<template>
  <el-form-item :label="field.label" :prop="field.key">
    <el-switch
      :model-value="Boolean(modelValue)"
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

function handleChange(val: unknown) {
  const v = Boolean(val)
  if (v !== Boolean(props.modelValue)) {
    emit('update:modelValue', v)
  }
}
</script>
