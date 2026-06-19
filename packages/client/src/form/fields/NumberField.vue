<template>
  <el-form-item :label="field.label" :prop="field.key">
    <el-input-number
      :model-value="typeof modelValue === 'number' ? modelValue : undefined"
      :placeholder="field.placeholder || `请输入${field.label}`"
      :disabled="field.disabled"
      style="width: 100%"
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

function handleChange(val: number | undefined) {
  if (val !== (typeof props.modelValue === 'number' ? props.modelValue : undefined)) {
    emit('update:modelValue', val)
  }
}
</script>
