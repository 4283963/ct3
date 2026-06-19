<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <el-icon :size="28" color="#409eff"><User /></el-icon>
            <div class="stat-content">
              <div class="stat-label">在线用户</div>
              <div class="stat-value">{{ stats.onlineUsers }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <el-icon :size="28" color="#67c23a"><Document /></el-icon>
            <div class="stat-content">
              <div class="stat-label">可用表单</div>
              <div class="stat-value">{{ stats.availableForms }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <el-icon :size="28" color="#e6a23c"><Shield /></el-icon>
            <div class="stat-content">
              <div class="stat-label">我的角色</div>
              <div class="stat-value">{{ stats.myRoles }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <el-icon :size="28" color="#f56c6c"><Lock /></el-icon>
            <div class="stat-content">
              <div class="stat-label">权限项</div>
              <div class="stat-value">{{ stats.permissions }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>系统说明</span>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item timestamp="架构特点" color="#409eff">
              <h4>动态 RBAC 权限网关</h4>
              <p>后端基于 JWT 解析角色，下发动态路由表；前端根据权限动态注册路由与菜单。</p>
            </el-timeline-item>
            <el-timeline-item timestamp="架构特点" color="#67c23a">
              <h4>分层清晰的代码结构</h4>
              <p>后端遵循 Koa + Controller/Service/Middleware/Model 分层；前端采用 API/Store/Router/View/Form 分层。</p>
            </el-timeline-item>
            <el-timeline-item timestamp="架构特点" color="#e6a23c">
              <h4>JSON 驱动的动态表单</h4>
              <p>通过 FormSchema JSON 配置，直接渲染出包含 input/select/radio/switch/date/upload 等多种控件的表单。</p>
            </el-timeline-item>
            <el-timeline-item timestamp="架构特点" color="#f56c6c">
              <h4>可插拔的字段系统</h4>
              <p>字段通过 fieldResolver 映射，新增字段类型只需在 fields 目录添加组件并在 resolver 中注册。</p>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>当前用户信息</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="姓名">
              {{ userStore.userInfo?.name }}
            </el-descriptions-item>
            <el-descriptions-item label="账号">
              {{ userStore.userInfo?.username }}
            </el-descriptions-item>
            <el-descriptions-item label="邮箱">
              {{ userStore.userInfo?.email }}
            </el-descriptions-item>
            <el-descriptions-item label="角色">
              <el-tag
                v-for="role in userStore.userInfo?.roleCodes"
                :key="role"
                :type="role === 'super_admin' ? 'danger' : role === 'department_manager' ? 'warning' : 'info'"
                size="small"
                style="margin-right: 4px;"
              >
                {{ role }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="权限">
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                <el-tag
                  v-for="perm in userStore.userInfo?.permissions"
                  :key="perm"
                  size="small"
                  type="success"
                  effect="plain"
                >
                  {{ perm }}
                </el-tag>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useFormStore } from '@/stores/form'

const userStore = useUserStore()
const formStore = useFormStore()

const stats = ref({
  onlineUsers: 128,
  availableForms: 0,
  myRoles: 0,
  permissions: 0
})

onMounted(async () => {
  const list = await formStore.fetchSchemas()
  stats.value.availableForms = list.length
  stats.value.myRoles = userStore.userInfo?.roleCodes.length ?? 0
  stats.value.permissions = userStore.userInfo?.permissions?.length ?? 0
})
</script>

<style scoped>
.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-content .stat-label {
  color: #909399;
  font-size: 14px;
  margin-bottom: 4px;
}

.stat-content .stat-value {
  font-size: 26px;
  font-weight: 600;
  color: #303133;
}

.card-header {
  font-weight: 600;
}

h4 {
  margin: 0 0 6px;
}

p {
  margin: 0;
  color: #606266;
}
</style>
