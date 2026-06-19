<template>
  <el-form-item :label="field.label" :prop="field.key">
    <el-input
      :model-value="String(modelValue ?? '')"
      type="textarea"
      :placeholder="field.placeholder || `请输入${field.label}`"
      :disabled="field.disabled"
      v-bind="field.props || {}"
      @update:model-value="handleChange"
    />
  </el-form-item>
</template>

<script setup lang="ts">
import type { FormField } from '@/types'

const props = defineProps<{
  field: FormField
  modelValue: unknown
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

function handleChange(val: string | number) {
  const v = String(val)
  if (v !== String(props.modelValue ?? '')) {
    emit('update:modelValue', v)
  }
}
</script>
