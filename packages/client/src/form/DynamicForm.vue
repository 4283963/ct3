<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    :label-width="schema.layout.labelWidth || 120"
    :inline="false"
  >
    <el-row :gutter="20">
      <el-col
        v-for="field in renderFields"
        :key="field.key"
        :span="24 / Math.max(1, Math.min(schema.layout.columns, 4))"
      >
        <component
          :is="resolveFieldComponent(field.type)"
          :field="field"
          :model-value="formData[field.key]"
          @update:model-value="(val: unknown) => handleFieldChange(field.key, val)"
        />
      </el-col>
    </el-row>
    <div class="form-actions" style="margin-top: 24px; text-align: right;">
      <el-button @click="handleReset">重置</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">提交</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { FormSchema, FormField } from '@/types'
import { resolveFieldComponent } from './fieldResolver'
import { buildDefaultValues, buildFieldRules, getDefaultForType } from './formUtils'
import { formApi } from '@/api/form'
import { ElMessage } from 'element-plus'

type FieldOption = { label: string; value: string | number | boolean }

const props = defineProps<{
  schema: FormSchema
  initialValues?: Record<string, unknown>
}>()

const emit = defineEmits<{
  (e: 'submit', values: Record<string, unknown>): void
  (e: 'change', values: Record<string, unknown>): void
}>()

const formRef = ref<FormInstance>()
const submitting = ref(false)

const formData = reactive<Record<string, unknown>>({})

const dynamicOptions = reactive<Record<string, FieldOption[]>>({})

function initFormData() {
  const defaults = buildDefaultValues(props.schema.fields)
  Object.assign(formData, defaults, props.initialValues || {})
}

initFormData()

props.schema.fields.forEach((field: FormField) => {
  if (!field.dependsOn || !field.optionsMap) return

  const depKey = field.dependsOn
  const initDep = formData[depKey]
  dynamicOptions[field.key] = field.optionsMap[String(initDep)] || []

  watch(
    () => formData[depKey],
    (newDep) => {
      const newOptions = field.optionsMap![String(newDep)] || []
      dynamicOptions[field.key] = newOptions
      const currentVal = formData[field.key]
      const inOptions = newOptions.some((o) => o.value === currentVal)
      if (!inOptions) {
        formData[field.key] = getDefaultForType(field.type)
      }
    }
  )
})

const renderFields = computed<FormField[]>(() =>
  props.schema.fields.map((field) => {
    if (field.dependsOn && field.optionsMap && dynamicOptions[field.key]) {
      return { ...field, options: dynamicOptions[field.key] }
    }
    return field
  })
)

const rules = computed<FormRules>(() => {
  const r: FormRules = {}
  props.schema.fields.forEach((field) => {
    r[field.key] = buildFieldRules(field)
  })
  return r
})

function handleFieldChange(key: string, value: unknown) {
  formData[key] = value
  emit('change', { ...formData })
}

async function handleSubmit() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    submitting.value = true
    if (props.schema.submitUrl) {
      await formApi.submitForm(props.schema.id, { ...formData })
    }
    ElMessage.success('提交成功')
    emit('submit', { ...formData })
  } catch {
    ElMessage.warning('请检查表单填写')
  } finally {
    submitting.value = false
  }
}

async function handleReset() {
  if (formRef.value) {
    await formRef.value.resetFields()
    initFormData()
    props.schema.fields.forEach((field: FormField) => {
      if (field.dependsOn && field.optionsMap) {
        const depVal = formData[field.dependsOn]
        dynamicOptions[field.key] = field.optionsMap[String(depVal)] || []
      }
    })
  }
}
</script>
