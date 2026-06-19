<template>
  <el-container class="layout-container" style="height: 100vh;">
    <el-aside width="220px" class="layout-aside">
      <div class="logo">
        <el-icon :size="22"><Lock /></el-icon>
        <span>RBAC 网关</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        class="side-menu"
        background-color="#001529"
        text-color="#b7c0cc"
        active-text-color="#ffffff"
      >
        <el-menu-item
          v-for="route in menuRoutes"
          :key="route.path"
          :index="route.path.startsWith('/') ? route.path : '/' + route.path"
        >
          <el-icon><component :is="route.meta.icon || 'Menu'" /></el-icon>
          <template #title>{{ route.meta.title }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="layout-header">
        <div class="header-title">{{ currentTitle }}</div>
        <div class="header-user">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" style="background-color: #409eff;">
                {{ userStore.userInfo?.name?.charAt(0) || 'U' }}
              </el-avatar>
              <span style="margin-left: 8px;">{{ userStore.userInfo?.name || '用户' }}</span>
              <el-tag :type="roleTagType" size="small" style="margin-left: 8px;">
                {{ primaryRole }}
              </el-tag>
              <el-icon style="margin-left: 4px;"><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const menuRoutes = computed(() => {
  return userStore.routes.filter(r => !r.path.includes(':'))
})

const activeMenu = computed(() => route.path)

const currentTitle = computed(() => (route.meta?.title as string) || '')

const primaryRole = computed(() => {
  if (!userStore.userInfo) return ''
  if (userStore.hasRole('super_admin')) return '超级管理员'
  if (userStore.hasRole('department_manager')) return '部门经理'
  if (userStore.hasRole('employee')) return '普通员工'
  return userStore.userInfo.roleCodes[0] || ''
})

const roleTagType = computed(() => {
  if (userStore.hasRole('super_admin')) return 'danger'
  if (userStore.hasRole('department_manager')) return 'warning'
  return 'info'
})

async function handleCommand(cmd: string) {
  if (cmd === 'logout') {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.layout-aside {
  background-color: #001529;
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #1f2d3d;
}

.side-menu {
  border-right: none;
  height: calc(100vh - 60px);
}

.layout-header {
  background: #ffffff;
  border-bottom: 1px solid #e6e8eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #303133;
}

.layout-main {
  background-color: #f5f7fa;
  padding: 24px;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
