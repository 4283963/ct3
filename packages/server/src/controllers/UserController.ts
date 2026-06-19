import { Context } from 'koa'
import { UserService } from '../services/UserService.js'
import { RoleService } from '../services/RoleService.js'
import { success } from '../utils/response.js'

export const UserController = {
  async listUsers(ctx: Context): Promise<void> {
    const users = await UserService.listUsers()
    ctx.body = success(users, '获取用户列表成功')
  },

  async listRoles(ctx: Context): Promise<void> {
    const roles = await RoleService.listRoles()
    ctx.body = success(roles, '获取角色列表成功')
  },

  async listPermissions(ctx: Context): Promise<void> {
    const permissions = await RoleService.listPermissions()
    ctx.body = success(permissions, '获取权限列表成功')
  }
}
