import type { FormField } from '@/types'

export function buildDefaultValues(fields: FormField[]): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  fields.forEach(field => {
    if (field.defaultValue !== undefined) {
      values[field.key] = field.defaultValue
    } else {
      values[field.key] = getDefaultForType(field.type)
    }
  })
  return values
}

export function getDefaultForType(type: FormField['type']): unknown {
  switch (type) {
    case 'checkbox':
      return []
    case 'switch':
      return false
    case 'number':
      return undefined
    default:
      return ''
  }
}

export function resolveFieldOptions(
  field: FormField,
  depValue: unknown,
  dynamicOverride?: Array<{ label: string; value: string | number | boolean }>
): Array<{ label: string; value: string | number | boolean }> {
  if (dynamicOverride) return dynamicOverride
  if (field.dependsOn && field.optionsMap) {
    return field.optionsMap[String(depValue)] || []
  }
  return field.options || []
}

export function buildFieldRules(field: FormField) {
  const rules: Array<{ required?: boolean; message: string; trigger?: string; type?: string; min?: number; max?: number; pattern?: RegExp }> = []
  if (field.required) {
    const message = `请${field.type === 'select' || field.type === 'checkbox' || field.type === 'radio' ? '选择' : '输入'}${field.label}`
    if (field.type === 'checkbox') {
      rules.push({ type: 'array', required: true, message, trigger: 'change' })
    } else {
      rules.push({ required: true, message, trigger: field.type === 'input' || field.type === 'textarea' ? 'blur' : 'change' })
    }
  }
  if (field.rules) {
    field.rules.forEach(rule => {
      const elRule: { type?: string; message: string; min?: number; max?: number; pattern?: RegExp; trigger?: string } = {
        message: rule.message,
        trigger: 'blur'
      }
      if (rule.type) elRule.type = rule.type
      if (rule.min !== undefined) elRule.min = rule.min
      if (rule.max !== undefined) elRule.max = rule.max
      if (rule.pattern) elRule.pattern = new RegExp(rule.pattern)
      rules.push(elRule)
    })
  }
  return rules
}
