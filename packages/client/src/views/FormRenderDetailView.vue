<template>
  <div>
    <el-page-header @back="$router.back()" :content="renderSchema?.name || '表单详情'">
      <template #content>
        <div style="display: flex; align-items: center; gap: 12px;">
          <h3 style="margin: 0;">{{ renderSchema?.name }}</h3>
          <el-tag v-if="importedSchema" size="small" type="success">已导入配置</el-tag>
          <el-tag v-else size="small" type="info">{{ renderSchema?.description }}</el-tag>
        </div>
      </template>
      <template #extra>
        <div style="display: flex; gap: 8px;">
          <el-button size="default" @click="handleImport">
            <el-icon><Upload /></el-icon>
            导入配置
          </el-button>
          <el-button size="default" @click="handleExport" :disabled="!formRef">
            <el-icon><Download /></el-icon>
            导出配置
          </el-button>
          <el-button v-if="importedSchema" size="default" type="danger" @click="clearImport">
            清除导入
          </el-button>
        </div>
      </template>
    </el-page-header>

    <el-card style="margin-top: 20px;" v-loading="loading">
      <template v-if="renderSchema">
        <DynamicForm
          ref="formRef"
          :schema="renderSchema"
          @submit="onSubmit"
          @import="onImport"
        />
      </template>
      <el-empty v-else description="表单不存在或您无权限访问" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { DynamicForm, type FormPortPackage } from '@/form'
import type { FormSchema } from '@/types'
import { useFormStore } from '@/stores/form'
import { Upload, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const formStore = useFormStore()
const schema = ref<FormSchema | null>(null)
const importedSchema = ref<FormSchema | null>(null)
const importedData = ref<Record<string, unknown> | null>(null)
const loading = ref(false)
const formRef = ref<InstanceType<typeof DynamicForm>>()

const renderSchema = computed(() => importedSchema.value || schema.value)

async function onSubmit(values: Record<string, unknown>) {
  console.log('Form submitted:', values)
}

function onImport(payload: { schema: FormSchema; data: Record<string, unknown> }) {
  importedSchema.value = payload.schema
  ElMessage.success('配置已导入，表单已复原')
}

async function handleImport() {
  if (!formRef.value) return
  await formRef.value.importPackage()
}

async function handleExport() {
  if (!formRef.value || !renderSchema.value) return
  const fileName = `${renderSchema.value.name}-${Date.now()}.formpkg`
  await formRef.value.exportPackage(fileName)
  ElMessage.success('配置文件导出成功')
}

function clearImport() {
  importedSchema.value = null
  importedData.value = null
  formRef.value?.reset()
}

async function applyImportedData() {
  if (!formRef.value || !importedData.value) return
  await nextTick()
  formRef.value.setFormData(importedData.value)
  importedData.value = null
}

onMounted(async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    const state = (history.state as { pkg?: unknown } | null)?.pkg as FormPortPackage | undefined

    if (state) {
      importedSchema.value = state.schema
      importedData.value = state.data
      applyImportedData()
    } else if (id && id !== 'import') {
      schema.value = await formStore.fetchSchema(id)
    }
  } finally {
    loading.value = false
  }
})
</script>
