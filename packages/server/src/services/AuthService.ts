import type { JwtPayload } from '../types/index.js'
import { UserService } from './UserService.js'
import { RoleService } from './RoleService.js'
import { generateToken } from '../utils/jwt.js'
import { ApiError } from '../utils/response.js'

export interface LoginResult {
  token: string
  user: {
    id: string
    username: string
    name: string
    email: string
    roleIds: string[]
    roleCodes: string[]
  }
}

export const AuthService = {
  async login(username: string, password: string): Promise<LoginResult> {
    const user = await UserService.findByUsername(username)
    if (!user) {
      throw new ApiError(400, '用户名或密码错误')
    }
    const valid = await UserService.verifyPassword(user, password)
    if (!valid) {
      throw new ApiError(400, '用户名或密码错误')
    }
    const roleCodes = await RoleService.getRoleCodesByUser(user.id)
    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      roleIds: user.roleIds
    }
    const token = generateToken(payload)
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        roleIds: user.roleIds,
        roleCodes
      }
    }
  },

  async getCurrentUserInfo(userId: string) {
    const user = await UserService.findById(userId)
    if (!user) {
      throw new ApiError(404, '用户不存在')
    }
    const roleCodes = await RoleService.getRoleCodesByUser(userId)
    const permissions = await RoleService.getPermissionsByRoleIds(user.roleIds)
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      roleIds: user.roleIds,
      roleCodes,
      permissions: permissions.map(p => p.code)
    }
  }
}
