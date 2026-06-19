<template>
  <el-form-item :label="field.label" :prop="field.key">
    <el-input-number
      v-model="localValue"
      :placeholder="field.placeholder || `请输入${field.label}`"
      :disabled="field.disabled"
      style="width: 100%"
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

const localValue = ref<number | undefined>(typeof props.modelValue === 'number' ? props.modelValue : undefined)

watch(() => props.modelValue, (v) => {
  localValue.value = typeof v === 'number' ? v : undefined
})
</script>
