import { get } from '@/utils/request'
import type { RouteConfig } from '@/types'

export const routeApi = {
  getUserRoutes: () => get<RouteConfig[]>('/api/routes'),
  listAllRoutes: () => get<RouteConfig[]>('/api/routes/all')
}
