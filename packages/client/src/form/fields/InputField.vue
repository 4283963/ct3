<template>
  <el-form-item :label="field.label" :prop="field.key">
    <el-input
      v-model="localValue"
      :placeholder="field.placeholder || `请输入${field.label}`"
      :disabled="field.disabled"
      v-bind="field.props || {}"
      @input="emit('update:modelValue', localValue)"
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

const localValue = ref<string>(String(props.modelValue ?? ''))

watch(() => props.modelValue, (v) => {
  localValue.value = String(v ?? '')
})
</script>
