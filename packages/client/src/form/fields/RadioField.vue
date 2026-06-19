<template>
  <el-form-item :label="field.label" :prop="field.key">
    <el-radio-group
      :model-value="modelValue"
      :disabled="field.disabled"
      @update:model-value="handleChange"
    >
      <el-radio
        v-for="opt in field.options || []"
        :key="String(opt.value)"
        :value="opt.value"
        :label="opt.value"
      >
        {{ opt.label }}
      </el-radio>
    </el-radio-group>
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
