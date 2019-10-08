import GroupMod from '../models/group'
import GroupNodeMod from '../models/groupNode'
import * as R from 'ramda'

class Group {
	constructor() {}

	async list(ctx) {
		const page = parseInt(ctx.query.page) || 1
		const limit = parseInt(ctx.query.limit) || 10
		let items = await GroupMod.find().skip((page - 1) * limit).limit(limit).sort({
			'_id': -1
		}).exec()
		const total = await GroupMod.count()
		const group_ids=R.pluck('_id')(items)
		let groupNodes=await GroupNodeMod.find({
			'group': {
				$in: group_ids
			}
		})

		groupNodes= R.groupBy((groupNode)=>{
			return groupNode.group
		})(groupNodes)

		items=R.project(['_id', 'title','meta'], items).map((item)=>{
			item.node_ids=(groupNodes[item._id]?R.pluck('node')(groupNodes[item._id]):[])
			return item
		})

		return (ctx.body = {
			code: 20000,
			data: {
				items,
				total
			}
		})
	}

	async add(ctx){
		const title= ctx.request.body.title;
		const node_ids= ctx.request.body.node_ids;
		const item = await GroupMod.findOne({
			title
		})
		if(item){
			return (ctx.body = {
				code: 0,
				data: {},
				message:`${title}用户组已经存在`
			})
		}

		const group=await new GroupMod({
			title
		}).save()

		if(node_ids&&node_ids.length){
			node_ids.forEach(async node_id=>{
				await new GroupNodeMod({
					group:group._id,
					node:node_id
				}).save()
			})
		}
		return (ctx.body = {
			code: 20000,
			data: {
				group:Object.assign(R.pick(['_id','title','meta'])(group),{
					node_ids
				})
			}
		})
	}

	async edit(ctx){
		const id=ctx.request.body.id;
		const title= ctx.request.body.title;
		const node_ids=ctx.request.body.node_ids;
		const item = await GroupMod.findOne({
			title
		})
		if(item&&item._id!=id){
			return (ctx.body = {
				code: 0,
				data: {},
				message:`${title}用户组已经存在`
			})
		}

		const result = await GroupMod.where({
			_id: id
		}).update({
			title
		})


		let nodes=await GroupNodeMod.find({
			'group': id
		})

		const beforeNodeIds=R.pluck('node')(nodes)
		const addNodeIds=R.difference(node_ids,beforeNodeIds)
		const delNodeIds=R.difference(beforeNodeIds,node_ids)
		if(addNodeIds.length){
			addNodeIds.forEach(async node_id => {
				await new GroupNodeMod({
					group: id,
					node: node_id
				}).save()
			})
		}

		if(delNodeIds.length){
			delNodeIds.forEach(async node_id => {
				await  GroupNodeMod.where({
					group: id,
					node: node_id
				}).remove()
			})
		}
		
		return (ctx.body = {
			code: 20000,
			data: {}
		})
	}


}

export default new Group()