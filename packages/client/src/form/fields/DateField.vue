<template>
  <el-form-item :label="field.label" :prop="field.key">
    <el-date-picker
      :model-value="modelValue ?? ''"
      :type="(field.props?.type as string) || 'date'"
      :placeholder="field.placeholder || `请选择${field.label}`"
      :disabled="field.disabled"
      style="width: 100%"
      value-format="YYYY-MM-DD"
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

function handleChange(val: unknown) {
  const v = val ?? ''
  if (v !== (props.modelValue ?? '')) {
    emit('update:modelValue', v)
  }
}
</script>
