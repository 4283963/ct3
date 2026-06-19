<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>角色列表</span>
            </div>
          </template>
          <el-table :data="roles" v-loading="loading" stripe>
            <el-table-column prop="code" label="角色编码" width="180" />
            <el-table-column prop="name" label="角色名称" width="140" />
            <el-table-column prop="description" label="描述" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>权限列表</span>
            </div>
          </template>
          <el-table :data="permissions" v-loading="loading" stripe>
            <el-table-column prop="code" label="权限编码" width="180" />
            <el-table-column prop="name" label="权限名称" width="140" />
            <el-table-column prop="resource" label="资源" width="100" />
            <el-table-column prop="action" label="操作" width="100">
              <template #default="{ row }">
                <el-tag :type="actionTagType(row.action)" size="small">
                  {{ row.action }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userApi } from '@/api/user'
import type { Role, Permission } from '@/types'

const roles = ref<Role[]>([])
const permissions = ref<Permission[]>([])
const loading = ref(false)

function actionTagType(action: string) {
  switch (action) {
    case 'read': return 'info'
    case 'write': return 'warning'
    case 'delete': return 'danger'
    case 'admin': return 'danger'
    default: return ''
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const [r, p] = await Promise.all([userApi.listRoles(), userApi.listPermissions()])
    roles.value = r
    permissions.value = p
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.card-header {
  font-weight: 600;
}
</style>
