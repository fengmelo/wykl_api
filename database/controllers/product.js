import ProductMod from '../models/product'
import xss from "xss"

class Product {
	constructor() {}

	async list(ctx) {
		let page = parseInt(ctx.query.page)
		let limit = parseInt(ctx.query.limit)


		const sort=ctx.query.sort
		const prop=ctx.query.prop
		let order={
			'_id': -1
		}
		if(sort){
			order={
				[prop]:sort=='descending'?-1:1
			}
		}

		let where = {}

		const title = xss(ctx.query.title)
		if (title) {
			where.$or = [{
					title: {
						$regex: title
					}
				},
				{
					desc: {
						$regex: title,
					}
				}
			]
		}

		const isKl = parseInt(ctx.query.isKl)
		isKl == 1 && (where.isKl = true)
		isKl == 2 && (where.isKl = false)

		const tag = ctx.query.tag
		if (tag) {
			where.tags= {
				$elemMatch: {
					$eq: tag
				}
			}
		}

		const type = parseInt(ctx.query.type)
		if (type) {
			where.showPlanes= {
				$elemMatch: {
					$eq: type
				}
			}
			page=1
			limit=9
		}

		if(parseInt(ctx.query.isExport)){
			page=1
			limit=10000
		}
		console.log('order=',order)
		let items = await ProductMod.find(where).skip((page - 1) * limit).limit(limit).populate({
			path: 'user',
			select: 'username'
		}).sort(order).exec()
		const total = await ProductMod.count(where)


		return (ctx.body = {
			code: 20000,
			data: {
				items,
				total
			}
		})
	}

	async detail(ctx) {
		let id= ctx.query.id
	
		let product = await ProductMod.findOne({_id:id}).populate({
			path: 'user',
			select: 'username'
		}).sort({
			'_id': -1
		}).exec()


		return (ctx.body = {
			code: 20000,
			data: {
				product
			}
		})
	}

	async create(ctx) {
		let product = new ProductMod({
			title: ctx.request.body.title,
			recommend: ctx.request.body.recommend,
			desc: ctx.request.body.desc,
			newPrice: ctx.request.body.newPrice,
			vipPrice: ctx.request.body.vipPrice,
			discount: ctx.request.body.discount,
			beginTime: parseInt(ctx.request.body.beginTime),
			endTime: parseInt(ctx.request.body.endTime),
			price: ctx.request.body.price,
			isKl: ctx.request.body.isKl,
			tags: ctx.request.body.tags,
			models: ctx.request.body.models,
			attrs: ctx.request.body.attrs,
			showPlanes: ctx.request.body.showPlanes,
			carousel: ctx.request.body.carousel,
			content: ctx.request.body.content,
			user: ctx.user._id,
			weight: parseInt(ctx.request.body.weight || 0),
		})
		await product.save()
		// mongoose.Types.ObjectId(obj._id)

		return (ctx.body = {
			code: 20000,
			data: product
		})
	}


	async edit(ctx) {
		const id=ctx.request.body.id;
	
		const showPlanes= ctx.request.body.showPlanes
		let result = await ProductMod.where({_id:id}).update({
			title: ctx.request.body.title,
			recommend: ctx.request.body.recommend,
			desc: ctx.request.body.desc,
			newPrice: ctx.request.body.newPrice,
			vipPrice: ctx.request.body.vipPrice,
			discount: ctx.request.body.discount,
			beginTime: parseInt(ctx.request.body.beginTime),
			endTime: parseInt(ctx.request.body.endTime),
			price: ctx.request.body.price,
			isKl: ctx.request.body.isKl,
			tags: ctx.request.body.tags,
			models: ctx.request.body.models,
			attrs: ctx.request.body.attrs,
			showPlanes: showPlanes.map(plane=>{
				return parseInt(plane)
			}),
			carousel: ctx.request.body.carousel,
			content: ctx.request.body.content,
			weight: parseInt(ctx.request.body.weight || 0),
		})
		if (result && result.ok == 1) {
			return (ctx.body = {
				code: 20000,
				data: ''
			})
		}
		return (ctx.body = {
			code: 0,
			data: ''
		})
		
	}

	async handle(ctx){
		const id=ctx.request.body.id
		const product = await ProductMod.findOne({
			_id: id
		})
		product.status=product.status==1?2:1
		await product.save()
		ctx.body={
			code:20000
		}
	}

}

export default new Product()