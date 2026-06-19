<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" :disabled="true">新增用户（演示）</el-button>
        </div>
      </template>
      <el-table :data="users" v-loading="loading" stripe>
        <el-table-column prop="username" label="账号" width="140" />
        <el-table-column prop="name" label="姓名" width="140" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column label="角色" width="260">
          <template #default="{ row }">
            <el-tag
              v-for="roleId in row.roleIds"
              :key="roleId"
              size="small"
              style="margin-right: 4px;"
            >
              {{ getRoleName(roleId) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default>
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userApi } from '@/api/user'
import type { User, Role } from '@/types'

const users = ref<User[]>([])
const roles = ref<Role[]>([])
const loading = ref(false)

function getRoleName(roleId: string) {
  return roles.value.find(r => r.id === roleId)?.name || roleId
}

onMounted(async () => {
  loading.value = true
  try {
    const [u, r] = await Promise.all([userApi.listUsers(), userApi.listRoles()])
    users.value = u
    roles.value = r
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
