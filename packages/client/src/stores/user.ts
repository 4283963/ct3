import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, RouteConfig } from '@/types'
import { authApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('rbac_token'))
  const userInfo = ref<UserInfo | null>(null)
  const routes = ref<RouteConfig[]>([])
  const isLoggedIn = computed(() => !!token.value)

  async function login(username: string, password: string) {
    const result = await authApi.login(username, password)
    token.value = result.token
    localStorage.setItem('rbac_token', result.token)
    userInfo.value = result.user
    return result
  }

  async function fetchUserInfo() {
    const info = await authApi.me()
    userInfo.value = info
    return info
  }

  function setRoutes(routeList: RouteConfig[]) {
    routes.value = routeList
  }

  function hasRole(roleCode: string): boolean {
    if (!userInfo.value) return false
    if (userInfo.value.roleCodes.includes('super_admin')) return true
    return userInfo.value.roleCodes.includes(roleCode)
  }

  function hasAnyRole(roleCodes: string[]): boolean {
    if (!userInfo.value) return false
    if (userInfo.value.roleCodes.includes('super_admin')) return true
    return userInfo.value.roleCodes.some(r => roleCodes.includes(r))
  }

  function hasPermission(permissionCode: string): boolean {
    if (!userInfo.value?.permissions) return false
    if (userInfo.value.permissions.includes('system:admin')) return true
    return userInfo.value.permissions.includes(permissionCode)
  }

  function logout() {
    token.value = null
    userInfo.value = null
    routes.value = []
    localStorage.removeItem('rbac_token')
  }

  return {
    token,
    userInfo,
    routes,
    isLoggedIn,
    login,
    fetchUserInfo,
    setRoutes,
    hasRole,
    hasAnyRole,
    hasPermission,
    logout
  }
})
