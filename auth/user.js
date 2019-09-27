import jwt from 'jsonwebtoken'

export const verifyToken = async (ctx, next) => {
	const token = ctx.request.headers["x-token"] // 从body或query或者header中获取token

	await new Promise(function (resolve, reject) {


		jwt.verify(token, 'dingjianblog', (err, decode) => {
			if (err) {
				return resolve(ctx.body = {
					code: 9,
					message: "登录信息过期，请重新登录"
				})
			} else {
				ctx.user = decode
				resolve(next())
			}
		})
	});

}



export const verifyTokenFront = async (ctx, next) => {
	const token = ctx.request.headers["f-token"] // 从body或query或者header中获取token

	await new Promise(function (resolve, reject) {


		jwt.verify(token, 'fuser_kl', (err, decode) => {
			if (err) {
				return resolve(ctx.body = {
					code: 9,
					message: "登录信息过期，请重新登录"
				})
			} else {
				ctx.user = decode
				resolve(next())
			}
		})
	});

}