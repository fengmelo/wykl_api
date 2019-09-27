import SliderMod from '../models/slider'

class Slider {
	constructor() {}

	async list(ctx) {
		const page = parseInt(ctx.query.page)
		const limit = parseInt(ctx.query.limit)
		let items = await SliderMod.find().skip((page - 1) * limit).limit(limit).populate({
			path: 'user',
			select: 'username'
		}).sort({
			'_id': -1
		}).exec()
		const total = await SliderMod.count()


		return (ctx.body = {
			code: 20000,
			data: {
				items,
				total
			}
		})
	}

	async create(ctx) {
		let slider = new SliderMod({
			name: ctx.request.body.name,
			url: ctx.request.body.url,
			product: ctx.request.body.product,
			user: ctx.user._id,
			weight: parseInt(ctx.request.body.weight || 0),
		})
		await slider.save()
		// mongoose.Types.ObjectId(obj._id)
		slider = await SliderMod.findOne({
			'_id': slider._id
		}).populate({
			path: 'user',
			select: 'username'
		}).exec()
		return (ctx.body = {
			code: 20000,
			data: slider
		})
	}


	async edit(ctx) {
		const slider_id = ctx.request.body._id
		const result = await SliderMod.where({
			_id: ctx.request.body._id
		}).update({
			name: ctx.request.body.name,
			status: ctx.request.body.status,
			url: ctx.request.body.url,
			user: ctx.user._id,
			weight: ctx.request.body.weight
		})
		if (result && result.ok == 1) {
			const slider = await SliderMod.findOne({
				'_id': slider_id
			}).populate({
				path: 'user',
				select: 'username'
			}).exec()
			return (ctx.body = {
				code: 20000,
				data: slider
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

export default new Slider()