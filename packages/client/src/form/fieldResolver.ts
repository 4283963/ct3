import type { FormField } from '@/types'
import type { Component } from 'vue'
import InputField from './fields/InputField.vue'
import TextareaField from './fields/TextareaField.vue'
import NumberField from './fields/NumberField.vue'
import SelectField from './fields/SelectField.vue'
import RadioField from './fields/RadioField.vue'
import CheckboxField from './fields/CheckboxField.vue'
import SwitchField from './fields/SwitchField.vue'
import DateField from './fields/DateField.vue'
import UploadField from './fields/UploadField.vue'

const fieldComponentMap: Record<FormField['type'], Component> = {
  input: InputField,
  textarea: TextareaField,
  number: NumberField,
  select: SelectField,
  radio: RadioField,
  checkbox: CheckboxField,
  switch: SwitchField,
  date: DateField,
  upload: UploadField
}

export function resolveFieldComponent(type: FormField['type']): Component {
  const component = fieldComponentMap[type]
  if (!component) {
    console.warn(`Unknown field type: ${type}, falling back to input`)
    return fieldComponentMap.input
  }
  return component
}

export const availableFieldTypes = Object.keys(fieldComponentMap) as FormField['type'][]
