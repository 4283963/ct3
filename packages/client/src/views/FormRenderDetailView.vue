<template>
  <div>
    <el-page-header @back="$router.back()" :content="schema?.name || '表单详情'">
      <template #content>
        <div style="display: flex; align-items: center; gap: 12px;">
          <h3 style="margin: 0;">{{ schema?.name }}</h3>
          <el-tag size="small" type="info">{{ schema?.description }}</el-tag>
        </div>
      </template>
    </el-page-header>

    <el-card style="margin-top: 20px;" v-loading="loading">
      <template v-if="schema">
        <DynamicForm
          :schema="schema"
          @submit="onSubmit"
        />
      </template>
      <el-empty v-else description="表单不存在或您无权限访问" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { DynamicForm } from '@/form'
import type { FormSchema } from '@/types'
import { useFormStore } from '@/stores/form'

const route = useRoute()
const formStore = useFormStore()
const schema = ref<FormSchema | null>(null)
const loading = ref(false)

async function onSubmit(values: Record<string, unknown>) {
  console.log('Form submitted:', values)
}

onMounted(async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    schema.value = await formStore.fetchSchema(id)
  } finally {
    loading.value = false
  }
})
</script>
