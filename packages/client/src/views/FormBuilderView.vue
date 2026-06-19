<template>
  <div class="form-builder">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <template #header>
            <span class="card-header">字段组件</span>
          </template>
          <div class="field-palette">
            <div
              v-for="type in fieldTypes"
              :key="type"
              class="palette-item"
              @click="addField(type)"
            >
              <el-icon><component :is="getFieldIcon(type)" /></el-icon>
              <span>{{ getFieldLabel(type) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <template #header>
            <div class="card-header-wrapper">
              <span>表单编辑器</span>
              <el-input
                v-model="formName"
                placeholder="表单名称"
                size="small"
                style="width: 200px;"
              />
            </div>
          </template>
          <div class="editor-content">
            <div
              v-for="(field, idx) in fields"
              :key="field.key"
              class="field-editor-item"
              :class="{ active: selectedIdx === idx }"
              @click="selectField(idx)"
            >
              <div class="field-preview">
                <el-tag size="small" type="info">{{ getFieldLabel(field.type) }}</el-tag>
                <span class="field-label">{{ field.label }}</span>
                <el-tag v-if="field.required" size="small" type="danger" effect="plain">必填</el-tag>
              </div>
              <div class="field-actions">
                <el-button link size="small" @click.stop="moveUp(idx)" :disabled="idx === 0">
                  <el-icon><ArrowUp /></el-icon>
                </el-button>
                <el-button link size="small" @click.stop="moveDown(idx)" :disabled="idx === fields.length - 1">
                  <el-icon><ArrowDown /></el-icon>
                </el-button>
                <el-button link size="small" type="danger" @click.stop="removeField(idx)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div v-if="fields.length === 0" class="empty-hint">
              <el-empty description="点击左侧组件添加字段" :image-size="60" />
            </div>
          </div>
          <div style="margin-top: 16px; text-align: right;">
            <el-button @click="previewVisible = true">预览</el-button>
            <el-button type="primary" @click="saveSchema">保存表单</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span class="card-header">字段属性</span>
          </template>
          <div v-if="selectedField" class="property-panel">
            <el-form label-width="90px" size="small">
              <el-form-item label="字段标识">
                <el-input v-model="selectedField.key" />
              </el-form-item>
              <el-form-item label="字段标签">
                <el-input v-model="selectedField.label" />
              </el-form-item>
              <el-form-item label="占位符">
                <el-input v-model="selectedField.placeholder" />
              </el-form-item>
              <el-form-item label="是否必填">
                <el-switch v-model="selectedField.required" />
              </el-form-item>
              <el-form-item label="是否禁用">
                <el-switch v-model="selectedField.disabled" />
              </el-form-item>
              <template v-if="hasOptions(selectedField.type)">
                <el-form-item label="选项列表">
                  <div style="width: 100%">
                    <div
                      v-for="(opt, oIdx) in selectedField.options"
                      :key="oIdx"
                      style="display: flex; gap: 8px; margin-bottom: 4px;"
                    >
                      <el-input v-model="opt.label" placeholder="显示名" size="small" style="flex: 1;" />
                      <el-input v-model="opt.value" placeholder="值" size="small" style="flex: 1;" />
                      <el-button link type="danger" size="small" @click="removeOption(oIdx)">移除</el-button>
                    </div>
                    <el-button size="small" @click="addOption">+ 添加选项</el-button>
                  </div>
                </el-form-item>
              </template>
            </el-form>
          </div>
          <el-empty v-else description="请先选择字段" :image-size="60" />
        </el-card>

        <el-card style="margin-top: 20px;">
          <template #header>
            <span class="card-header">JSON 预览</span>
          </template>
          <pre class="json-preview">{{ schemaJson }}</pre>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="previewVisible" title="表单预览" width="720px">
      <DynamicForm v-if="previewVisible" :schema="previewSchema" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useFormStore } from '@/stores/form'
import { ElMessage } from 'element-plus'
import { availableFieldTypes } from '@/form/fieldResolver'
import { DynamicForm } from '@/form'
import type { FormField } from '@/types'
import {
  Edit,
  EditPen,
  Histogram,
  List,
  CircleCheck,
  Check,
  Switch,
  Calendar,
  Upload,
  ArrowUp,
  ArrowDown,
  Delete
} from '@element-plus/icons-vue'

const formStore = useFormStore()

const fieldTypes = availableFieldTypes
const formName = ref('新表单')
const fields = ref<FormField[]>([])
const selectedIdx = ref(-1)
const previewVisible = ref(false)

const selectedField = computed(() => (selectedIdx.value >= 0 ? fields.value[selectedIdx.value] : null))

const schemaJson = computed(() => JSON.stringify({
  name: formName.value,
  fields: fields.value
}, null, 2))

const previewSchema = computed(() => ({
  id: 'preview',
  name: formName.value,
  description: '预览模式',
  fields: fields.value,
  layout: { columns: 2, labelWidth: 120 },
  roles: ['super_admin'],
  createdAt: Date.now(),
  updatedAt: Date.now()
}))

function getFieldIcon(type: string) {
  const iconMap: Record<string, unknown> = {
    input: Edit,
    textarea: EditPen,
    number: Histogram,
    select: List,
    radio: CircleCheck,
    checkbox: Check,
    switch: Switch,
    date: Calendar,
    upload: Upload
  }
  return iconMap[type] || Edit
}

function getFieldLabel(type: string) {
  const labelMap: Record<string, string> = {
    input: '文本输入',
    textarea: '多行文本',
    number: '数字',
    select: '下拉选择',
    radio: '单选框',
    checkbox: '多选框',
    switch: '开关',
    date: '日期',
    upload: '文件上传'
  }
  return labelMap[type] || type
}

function hasOptions(type: string) {
  return ['select', 'radio', 'checkbox'].includes(type)
}

function addField(type: FormField['type']) {
  const field: FormField = reactive({
    key: `${type}_${Date.now()}`,
    type,
    label: getFieldLabel(type),
    required: false,
    disabled: false
  })
  if (hasOptions(type)) {
    field.options = [
      { label: '选项1', value: 'opt1' },
      { label: '选项2', value: 'opt2' }
    ]
  }
  fields.value.push(field)
  selectedIdx.value = fields.value.length - 1
}

function selectField(idx: number) {
  selectedIdx.value = idx
}

function removeField(idx: number) {
  fields.value.splice(idx, 1)
  if (selectedIdx.value >= fields.value.length) {
    selectedIdx.value = fields.value.length - 1
  }
}

function moveUp(idx: number) {
  if (idx === 0) return
  const [item] = fields.value.splice(idx, 1)
  fields.value.splice(idx - 1, 0, item)
  selectedIdx.value = idx - 1
}

function moveDown(idx: number) {
  if (idx === fields.value.length - 1) return
  const [item] = fields.value.splice(idx, 1)
  fields.value.splice(idx + 1, 0, item)
  selectedIdx.value = idx + 1
}

function addOption() {
  if (!selectedField.value?.options) return
  const nextIdx = selectedField.value.options.length + 1
  selectedField.value.options.push({ label: `选项${nextIdx}`, value: `opt${nextIdx}` })
}

function removeOption(idx: number) {
  if (!selectedField.value?.options) return
  selectedField.value.options.splice(idx, 1)
}

async function saveSchema() {
  if (!formName.value.trim()) {
    ElMessage.warning('请输入表单名称')
    return
  }
  if (fields.value.length === 0) {
    ElMessage.warning('请至少添加一个字段')
    return
  }
  await formStore.createSchema({
    name: formName.value,
    description: `通过表单构造器创建 - ${formName.value}`,
    fields: JSON.parse(JSON.stringify(fields.value)),
    layout: { columns: 2, labelWidth: 120 },
    roles: ['super_admin', 'department_manager']
  })
  ElMessage.success('表单保存成功')
  fields.value = []
  formName.value = '新表单'
  selectedIdx.value = -1
}
</script>

<style scoped>
.card-header {
  font-weight: 600;
}

.card-header-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-palette {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.palette-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 8px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  cursor: grab;
  transition: all 0.2s;
  color: #606266;
  font-size: 13px;
}

.palette-item:hover {
  border-color: #409eff;
  color: #409eff;
  background: #ecf5ff;
}

.editor-content {
  min-height: 400px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  padding: 12px;
}

.field-editor-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  margin-bottom: 8px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  cursor: pointer;
  background: #fafafa;
}

.field-editor-item.active {
  border-color: #409eff;
  background: #ecf5ff;
}

.field-preview {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-label {
  font-size: 14px;
  color: #303133;
}

.field-actions {
  display: flex;
  gap: 4px;
}

.empty-hint {
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.property-panel {
  min-height: 300px;
}

.json-preview {
  margin: 0;
  padding: 12px;
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 6px;
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', monospace;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
