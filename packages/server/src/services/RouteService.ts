import { mockRoutes } from '../data/mockData.js'
import type { RouteConfig } from '../types/index.js'
import { RoleService } from './RoleService.js'

export const RouteService = {
  async getRoutesByUser(userId: string): Promise<RouteConfig[]> {
    const roleCodes = await RoleService.getRoleCodesByUser(userId)
    const hasAllAccess = roleCodes.includes('super_admin')

    return mockRoutes
      .filter(route => {
        if (hasAllAccess) return true
        return route.meta.roles.some(role => roleCodes.includes(role))
      })
      .map(route => ({
        ...route,
        children: route.children?.filter(child => {
          if (hasAllAccess) return true
          return child.meta.roles.some(role => roleCodes.includes(role))
        })
      }))
  },

  async listAllRoutes(): Promise<RouteConfig[]> {
    return mockRoutes
  }
}
