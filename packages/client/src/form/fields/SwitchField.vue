<template>
  <el-form-item :label="field.label" :prop="field.key">
    <el-switch
      v-model="localValue"
      :disabled="field.disabled"
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

const localValue = ref<boolean>(Boolean(props.modelValue))

watch(() => props.modelValue, (v) => {
  localValue.value = Boolean(v)
})
</script>
