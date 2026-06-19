<template>
  <el-form-item :label="field.label" :prop="field.key">
    <el-select
      v-model="localValue"
      :placeholder="field.placeholder || `请选择${field.label}`"
      :disabled="field.disabled"
      style="width: 100%"
      v-bind="field.props || {}"
      @change="emit('update:modelValue', localValue)"
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
