export interface User {
  id: string
  username: string
  password: string
  name: string
  email: string
  roleIds: string[]
  createdAt: number
  updatedAt: number
}

export interface Role {
  id: string
  code: string
  name: string
  description: string
  permissionIds: string[]
  createdAt: number
  updatedAt: number
}

export interface Permission {
  id: string
  code: string
  name: string
  resource: string
  action: 'read' | 'write' | 'delete' | 'admin'
  createdAt: number
  updatedAt: number
}

export interface RouteConfig {
  id: string
  path: string
  name: string
  component: string
  meta: {
    title: string
    icon?: string
    roles: string[]
    layout?: string
    keepAlive?: boolean
  }
  children?: RouteConfig[]
}

export interface FormField {
  key: string
  type: 'input' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' | 'switch' | 'date' | 'upload'
  label: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  rules?: Array<{ type?: string; message: string; pattern?: string; min?: number; max?: number }>
  options?: Array<{ label: string; value: string | number | boolean }>
  defaultValue?: unknown
  props?: Record<string, unknown>
  dependsOn?: string
  optionsMap?: Record<string, Array<{ label: string; value: string | number | boolean }>>
}

export interface FormSchema {
  id: string
  name: string
  description: string
  fields: FormField[]
  layout: {
    columns: number
    labelWidth?: number
  }
  submitUrl?: string
  roles: string[]
  createdAt: number
  updatedAt: number
}

export interface JwtPayload {
  userId: string
  username: string
  roleIds: string[]
  iat?: number
  exp?: number
}
