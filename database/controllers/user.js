import UserMod from '../models/user'
import UserGroupMod from '../models/userGroup'
import GroupNodeMod from '../models/groupNode'
import NodeMod from '../models/node'

import * as R from 'ramda'

class User {
	constructor() {}

	async info(ctx) {
		const {
			token
		} = ctx.query
		const user = await UserMod.findOne({
			token
		})
		if (!user) {
			return (ctx.body = {
				code: 50008,
				message: 'Login failed, unable to get user details.'
			})
		}
		const info = {
			introduction: 'I am a super administrator',
			avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
			name: user.username
		}

		const user_id=user._id
		const groups=await UserGroupMod.find({
			'user':user_id
		})

		const group_ids=R.pluck('group')(R.project(['group'])(groups))

		let node_codes=[]
		if(group_ids&&group_ids.length) {
			const groupNodes=await GroupNodeMod.find({
				'group':{
					$in: group_ids
				}
			})
			const node_ids=R.pluck('node')(R.project(['node'])(groupNodes))

			if(node_ids&&node_ids.length){
				const nodes=await NodeMod.find({
					'_id':{
						$in: node_ids
					}
				})

				node_codes=R.pluck('code')(R.project(['code'])(nodes))
			}
		}
		return (ctx.body = {
			code: 20000,
			data: {
				node_codes,
				info
			}
		})


		// return (ctx.body = {
		// 	code: 20000,
		// 	data: info
		// })
	}


	async list(ctx) {
		const page = parseInt(ctx.query.page) || 1
		const limit = parseInt(ctx.query.limit) || 10
		let items = await UserMod.find().skip((page - 1) * limit).limit(limit).sort({
			'_id': -1
		}).exec()
		const total = await UserMod.count()

		const user_ids=R.pluck('_id')(items)
		let groups=await UserGroupMod.find({
			'user': {
				$in: user_ids
			}
		})

		groups= R.groupBy((group)=>{
			return group.user
		})(groups)

		items=R.project(['_id', 'username','loginAttempts','meta'], items).map((item)=>{
			item.group_id=(groups[item._id]?R.pluck('group')(groups[item._id]):[])
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

	// async nodes(ctx){
	// 	const user_id=ctx.user._id
	// 	const groups=await UserGroupMod.find({
	// 		'user':user_id
	// 	})
	// 	const group_ids=R.pluck('group')(groups)
	// 	let node_ids=[]
	// 	if(group_ids&&group_ids.length) {
	// 		const groupNodes=await GroupNodeMod.find({
	// 			'group':{
	// 				$in: group_ids
	// 			}
	// 		})
	// 		node_ids=R.pluck('node')(groupNodes)
	// 	}

	// 	return (ctx.body = {
	// 		code: 20000,
	// 		data: {
	// 			node_ids
	// 		}
	// 	})
	// }

	async add(ctx) {
		const username = ctx.request.body.username;
		const password = ctx.request.body.password;
		const group_ids = ctx.request.body.group_id;

		const item = await UserMod.findOne({
			username
		})
		if (item) {
			return (ctx.body = {
				code: 0,
				data: {},
				message: `${username}管理员已经存在`
			})
		}

		const user = await new UserMod({
			username,
			password
		}).save()

		if (group_ids && group_ids.length) {
			group_ids.forEach(async group_id => {
				await new UserGroupMod({
					user: user._id,
					group: group_id
				}).save()
			})
		}

		return (ctx.body = {
			code: 20000,
			data: {
				user:Object.assign(R.pick(['_id','username','meta','loginAttempts'])(user),{group_id:group_ids})
			}
		})
	}

	async edit(ctx) {
		const id = ctx.request.body.id;
		const username = ctx.request.body.username;
		const group_ids = ctx.request.body.group_id;

		const item = await UserMod.findOne({
			username
		})
		if (item && item._id != id) {
			return (ctx.body = {
				code: 0,
				data: {},
				message: `${username}管理员已经存在`
			})
		}

		const result = await UserMod.where({
			_id: id
		}).update({
			username
		})


		let groups=await UserGroupMod.find({
			'user': id
		})

		const beforeGroupIds=R.pluck('group')(groups)
		const addGroupIds=R.difference(group_ids,beforeGroupIds)
		const delGroupIds=R.difference(beforeGroupIds,group_ids)
		if(addGroupIds.length){
			addGroupIds.forEach(async group_id => {
				await new UserGroupMod({
					user: item._id,
					group: group_id
				}).save()
			})
		}

		if(delGroupIds.length){
			delGroupIds.forEach(async group_id => {
				await  UserGroupMod.where({
					user: item._id,
					group: group_id
				}).remove()
			})
		}

		
		return (ctx.body = {
			code: 20000,
			data: {}
		})
	}

	async login(ctx) {
		const {
			username,
			password
		} = ctx.request.body
		const user = await UserMod.findOne({
			username: username
		})
		let match = false
		if (user) match = await user.comparePassword(password, user.password)
		if (match) {
			const token = user.getToken()
			user.token = token
			await user.save()

			user.incLoginAttempts()

			return (ctx.body = {
				code: 20000,
				data: {
					username: user.username,
					token: token
				}
			})
		}


		return (ctx.body = {
			code: 1,
			message: '密码错误'
		})
	}

	async logout(ctx) {
		return (ctx.body = {
			code: 20000,
			message: "登出"
		})
	}

}

export default new User()