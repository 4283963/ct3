<template>
  <el-form-item :label="field.label" :prop="field.key">
    <el-select
      :model-value="modelValue"
      :placeholder="field.placeholder || `请选择${field.label}`"
      :disabled="field.disabled"
      style="width: 100%"
      v-bind="field.props || {}"
      @update:model-value="handleChange"
    >
      <el-option
        v-for="opt in field.options || []"
        :key="String(opt.value)"
        :label="opt.label"
        :value="opt.value"
      />
    </el-select>
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
  if (val !== props.modelValue) {
    emit('update:modelValue', val)
  }
}
</script>
