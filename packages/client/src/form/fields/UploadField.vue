<template>
  <el-form-item :label="field.label" :prop="field.key">
    <el-upload
      action="#"
      :auto-upload="false"
      :multiple="true"
      :disabled="field.disabled"
      v-bind="field.props || {}"
      @change="handleChange"
    >
      <el-button type="primary">点击上传</el-button>
      <template #tip>
        <div class="el-upload__tip">支持任意格式文件上传（原型演示，不会实际上传）</div>
      </template>
    </el-upload>
  </el-form-item>
</template>

<script setup lang="ts">
import type { UploadFiles } from 'element-plus'
import type { FormField } from '@/types'

defineProps<{
  field: FormField
  modelValue: unknown
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

function handleChange(_uploadFile: unknown, uploadFiles: UploadFiles) {
  emit('update:modelValue', uploadFiles.map(f => f.name))
}
</script>
