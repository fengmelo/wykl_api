import UserMod from '../models/user'

class User {
    constructor() {}

		async info(ctx){
			const { token } = ctx.query
			const user = await UserMod.findOne({ token })
      if (!user) {
        return (ctx.body ={
          code: 50008,
          message: 'Login failed, unable to get user details.'
        })
      }
      const info ={
				roles: ['admin'],
				introduction: 'I am a super administrator',
				avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
				name: 'Super Admin'
			}

      return (ctx.body ={
        code: 20000,
        data: info
      })
		}
    async login(ctx) {
        const {username, password} = ctx.request.body
        const user = await UserMod.findOne({ username: username })
        let match = false
        if (user) match = await user.comparePassword(password, user.password)
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