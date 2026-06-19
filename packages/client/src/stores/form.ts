import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FormSchema } from '@/types'
import { formApi } from '@/api/form'

export const useFormStore = defineStore('form', () => {
  const schemas = ref<FormSchema[]>([])
  const loading = ref(false)

  async function fetchSchemas() {
    loading.value = true
    try {
      const list = await formApi.listSchemas()
      schemas.value = list
      return list
    } finally {
      loading.value = false
    }
  }

  async function fetchSchema(id: string) {
    return formApi.getSchema(id)
  }

  async function createSchema(data: Partial<FormSchema>) {
    const created = await formApi.createSchema(data)
    schemas.value.push(created)
    return created
  }

  async function updateSchema(id: string, data: Partial<FormSchema>) {
    const updated = await formApi.updateSchema(id, data)
    const idx = schemas.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      schemas.value[idx] = updated
    }
    return updated
  }

  async function deleteSchema(id: string) {
    await formApi.deleteSchema(id)
    schemas.value = schemas.value.filter(s => s.id !== id)
  }

  return {
    schemas,
    loading,
    fetchSchemas,
    fetchSchema,
    createSchema,
    updateSchema,
    deleteSchema
  }
})
