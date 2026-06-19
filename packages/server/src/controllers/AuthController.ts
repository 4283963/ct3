import { Context } from 'koa'
import { AuthService } from '../services/AuthService.js'
import { success } from '../utils/response.js'

export const AuthController = {
  async login(ctx: Context): Promise<void> {
    const { username, password } = ctx.request.body as { username: string; password: string }
    if (!username || !password) {
      ctx.body = success(null, '用户名和密码不能为空')
      ctx.status = 200
      return
    }
    const result = await AuthService.login(username, password)
    ctx.body = success(result, '登录成功')
  },

  async me(ctx: Context): Promise<void> {
    const { userId } = ctx.state.user as { userId: string }
    const userInfo = await AuthService.getCurrentUserInfo(userId)
    ctx.body = success(userInfo, '获取用户信息成功')
  }
}
