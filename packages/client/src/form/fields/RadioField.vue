<template>
  <el-form-item :label="field.label" :prop="field.key">
    <el-radio-group
      v-model="localValue"
      :disabled="field.disabled"
      @change="emit('update:modelValue', localValue)"
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
import { ref, watch } from 'vue'
import type { FormField } from '@/types'

const props = defineProps<{
  field: FormField
  modelValue: unknown
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

const localValue = ref<unknown>(props.modelValue)

watch(() => props.modelValue, (v) => {
  localValue.value = v
})
</script>
