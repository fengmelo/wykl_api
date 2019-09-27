import FuserMod from '../models/fuser'
import {createUser,checkUser} from '../models/fuser'

class Fuser {
    constructor() {}

    async login(ctx) {
        const {username, code} = ctx.request.body
				let user = await checkUser(username)
        let match = false
				if (code) match =true
				
				if(!user){
					user = await createUser(username)
				}
        if (match) {
            const token = user.getToken()
            user.token = token
            await user.save()

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
            message: '请输入验证码'
        })
    }

    async logout(ctx) {
        return (ctx.body = {
            code: 20000,
            message: "登出"
        })
    }

}

export default new Fuser()