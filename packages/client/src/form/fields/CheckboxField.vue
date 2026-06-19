<template>
  <el-form-item :label="field.label" :prop="field.key">
    <el-checkbox-group
      :model-value="Array.isArray(modelValue) ? [...(modelValue as unknown[])] : []"
      :disabled="field.disabled"
      @update:model-value="handleChange"
    >
      <el-checkbox
        v-for="opt in field.options || []"
        :key="String(opt.value)"
        :label="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </el-checkbox>
    </el-checkbox-group>
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
  const newArr = Array.isArray(val) ? [...val] : []
  const oldArr = Array.isArray(props.modelValue) ? [...(props.modelValue as unknown[])] : []
  if (newArr.length !== oldArr.length || newArr.some((v, i) => v !== oldArr[i])) {
    emit('update:modelValue', newArr)
  }
}
</script>
