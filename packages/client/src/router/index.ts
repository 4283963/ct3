import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { buildRouteRecords } from './routeBuilder'
import { routeApi } from '@/api/route'
import { useUserStore } from '@/stores/user'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录', public: true }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/ForbiddenView.vue'),
    meta: { title: '无权限', public: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '页面不存在', public: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

let dynamicRoutesLoaded = false

export function resetDynamicRoutes(): void {
  dynamicRoutesLoaded = false
}

async function loadDynamicRoutes(): Promise<void> {
  if (dynamicRoutesLoaded) return
  const userStore = useUserStore()
  const configList = await routeApi.getUserRoutes()
  userStore.setRoutes(configList)
  const records = buildRouteRecords(configList)
  records.forEach(record => router.addRoute(record))
  dynamicRoutesLoaded = true
}

router.beforeEach(async (to, from, next) => {
  document.title = to.meta?.title ? `${to.meta.title} - 企业级动态 RBAC 网关` : '企业级动态 RBAC 网关'

  const userStore = useUserStore()

  if (to.meta?.public) {
    if (to.path === '/login' && userStore.isLoggedIn) {
      next('/')
    } else {
      next()
    }
    return
  }

  if (!userStore.isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  try {
    if (!userStore.userInfo) {
      await userStore.fetchUserInfo()
    }
    await loadDynamicRoutes()

    if (to.name === 'NotFound') {
      next({ path: to.fullPath, replace: true })
      return
    }

    if (to.meta?.roles) {
      const allowed = userStore.hasAnyRole(to.meta.roles as string[])
      if (!allowed) {
        next('/403')
        return
      }
    }

    next()
  } catch (error) {
    userStore.logout()
    next({ path: '/login', query: { redirect: to.fullPath } })
  }
})

export default router
