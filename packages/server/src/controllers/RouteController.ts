import { Context } from 'koa'
import { RouteService } from '../services/RouteService.js'
import { success } from '../utils/response.js'

export const RouteController = {
  async getUserRoutes(ctx: Context): Promise<void> {
    const { userId } = ctx.state.user as { userId: string }
    const routes = await RouteService.getRoutesByUser(userId)
    ctx.body = success(routes, '获取路由配置成功')
  },

  async listAllRoutes(ctx: Context): Promise<void> {
    const routes = await RouteService.listAllRoutes()
    ctx.body = success(routes, '获取全部路由成功')
  }
}
