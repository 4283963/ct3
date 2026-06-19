<template>
  <el-form-item :label="field.label" :prop="field.key">
    <el-checkbox-group
      v-model="localValue"
      :disabled="field.disabled"
      @change="emit('update:modelValue', localValue)"
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
import { ref, watch } from 'vue'
import type { FormField } from '@/types'

const props = defineProps<{
  field: FormField
  modelValue: unknown
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

const localValue = ref<unknown[]>(Array.isArray(props.modelValue) ? [...props.modelValue] : [])

watch(() => props.modelValue, (v) => {
  localValue.value = Array.isArray(v) ? [...v] : []
}, { deep: true })
</script>
