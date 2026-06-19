<template>
  <el-form-item :label="field.label" :prop="field.key">
    <el-date-picker
      v-model="localValue"
      :type="(field.props?.type as string) || 'date'"
      :placeholder="field.placeholder || `请选择${field.label}`"
      :disabled="field.disabled"
      style="width: 100%"
      value-format="YYYY-MM-DD"
      v-bind="field.props || {}"
      @change="emit('update:modelValue', localValue)"
    />
  </el-form-item>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormField } from '@/types'

const props = defineProps<{
  field: FormField
  modelValue: unknown
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

const localValue = ref<unknown>(props.modelValue ?? '')

watch(() => props.modelValue, (v) => {
  localValue.value = v ?? ''
})
</script>
