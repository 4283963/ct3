import { get } from '@/utils/request'
import type { User, Role, Permission } from '@/types'

export const userApi = {
  listUsers: () => get<User[]>('/api/users'),
  listRoles: () => get<Role[]>('/api/roles'),
  listPermissions: () => get<Permission[]>('/api/permissions')
}
