import NodeMod from '../models/node'
import {toTree} from '../../common/util'
import * as R  from 'ramda'

class Node {
	constructor() {}

	async list(ctx) {
		const page = parseInt(ctx.query.page) || 1
		const limit = parseInt(ctx.query.limit) || 10
		let items = await NodeMod.find().skip((page - 1) * limit).limit(limit).sort({
			'_id': -1
		}).exec()
		const total = await NodeMod.count()

		return (ctx.body = {
			code: 20000,
			data: {
				items,
				total
			}
		})
	}

	async tree(ctx) {
		let items = await NodeMod.find().sort({
			'_id': 1
		}).exec()
		items=toTree(R.project(['_id', 'title','code','pid'], items))
		return (ctx.body = {
			code: 20000,
			data: {
				items
			}
		})
	}

	async add(ctx){
		const title= ctx.request.body.title;
		const code= ctx.request.body.code;
		const pid= ctx.request.body.pid;
		const item = await NodeMod.findOne({
			code
		})
		if(item){
			return (ctx.body = {
				code: 0,
				data: {},
				message:`${title}结点已经存在`
			})
		}

		const node=await new NodeMod({
			title,
			code,
			pid
		}).save()

		return (ctx.body = {
			code: 20000,
			data: {
				node
			}
		})
	}

	async edit(ctx){
		const id=ctx.request.body.id;
		const title= ctx.request.body.title;
		const code= ctx.request.body.code;
		const pid= ctx.request.body.pid;
		const item = await NodeMod.findOne({
			title
		})
		if(item&&item._id!=id){
			return (ctx.body = {
				code: 0,
				data: {},
				message:`${title}结点已经存在`
			})
		}

		const result = await NodeMod.where({
			_id: id
		}).update({
			title,
			code,
			pid
		})
		if (result && result.ok == 1) {
			return (ctx.body = {
				code: 20000,
				data: {}
			})
		}else{
			return (ctx.body = {
				code: 0,
				data: {},
				message:'update error'
			})
		}
	}


}

export default new Node()