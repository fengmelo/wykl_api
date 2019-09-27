import * as params from '../../config/enum'

class Config {
	constructor() {}

	async list(ctx) {
		const types=ctx.query.type.split(',')
		const data={}
		types.forEach(type=>{
			data[type]=params[type]
		})
		return (ctx.body = {
			code: 20000,
			data
		})
	}
}

export default new Config()