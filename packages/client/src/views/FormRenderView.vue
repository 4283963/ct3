<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>可用表单列表</span>
          <div>
            <el-input
              v-model="keyword"
              placeholder="搜索表单名称"
              size="default"
              clearable
              style="width: 240px; margin-right: 12px;"
              :prefix-icon="Search"
            />
          </div>
        </div>
      </template>
      <el-table :data="filteredSchemas" v-loading="formStore.loading" stripe>
        <el-table-column prop="name" label="表单名称" width="200" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="字段数量" width="100" align="center">
          <template #default="{ row }">{{ row.fields.length }}</template>
        </el-table-column>
        <el-table-column label="布局" width="100" align="center">
          <template #default="{ row }">{{ row.layout.columns }}列</template>
        </el-table-column>
        <el-table-column label="可用角色" width="220">
          <template #default="{ row }">
            <el-tag
              v-for="role in row.roles"
              :key="role"
              :type="role === 'super_admin' ? 'danger' : role === 'department_manager' ? 'warning' : 'info'"
              size="small"
              style="margin-right: 4px;"
            >
              {{ role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180">
          <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="goDetail(row.id)">填写</el-button>
            <el-button
              v-if="userStore.hasPermission('form:write')"
              link
              type="danger"
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFormStore } from '@/stores/form'
import { useUserStore } from '@/stores/user'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const formStore = useFormStore()
const userStore = useUserStore()
const router = useRouter()
const keyword = ref('')

const filteredSchemas = computed(() => {
  if (!keyword.value.trim()) return formStore.schemas
  return formStore.schemas.filter(s =>
    s.name.toLowerCase().includes(keyword.value.toLowerCase()) ||
    s.description.toLowerCase().includes(keyword.value.toLowerCase())
  )
})

function formatTime(ts: number) {
  return new Date(ts).toLocaleString()
}

function goDetail(id: string) {
  router.push(`/form-render/${id}`)
}

async function handleDelete(row: { id: string; name: string }) {
  await ElMessageBox.confirm(`确定删除表单「${row.name}」吗？`, '提示', {
    type: 'warning'
  })
  await formStore.deleteSchema(row.id)
  ElMessage.success('删除成功')
}

onMounted(() => {
  formStore.fetchSchemas()
})
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
