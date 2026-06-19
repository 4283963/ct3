import { mockRoles, mockPermissions } from '../data/mockData.js'
import type { Role, Permission } from '../types/index.js'

export const RoleService = {
  async getRolesByUser(userId: string): Promise<Role[]> {
    const { UserService } = await import('./UserService.js')
    const roleIds = await UserService.getUserRoles(userId)
    return mockRoles.filter(r => roleIds.includes(r.id))
  },

  async getRoleCodesByUser(userId: string): Promise<string[]> {
    const roles = await this.getRolesByUser(userId)
    return roles.map(r => r.code)
  },

  async getPermissionsByRoleIds(roleIds: string[]): Promise<Permission[]> {
    const roles = mockRoles.filter(r => roleIds.includes(r.id))
    const permissionIds = new Set<string>()
    roles.forEach(r => r.permissionIds.forEach(pid => permissionIds.add(pid)))
    return mockPermissions.filter(p => permissionIds.has(p.id))
  },

  async listRoles(): Promise<Role[]> {
    return mockRoles
  },

  async listPermissions(): Promise<Permission[]> {
    return mockPermissions
  },

  async hasPermission(userId: string, permissionCode: string): Promise<boolean> {
    const { UserService } = await import('./UserService.js')
    const roleIds = await UserService.getUserRoles(userId)
    const permissions = await this.getPermissionsByRoleIds(roleIds)
    return permissions.some(p => p.code === permissionCode || p.code === 'system:admin')
  }
}
