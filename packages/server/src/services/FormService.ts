import { mockFormSchemas } from '../data/mockData.js'
import type { FormSchema, FormField } from '../types/index.js'
import { RoleService } from './RoleService.js'
import { v4 as uuidv4 } from 'uuid'
import { ApiError } from '../utils/response.js'

export const FormService = {
  async listFormSchemasByUser(userId: string): Promise<FormSchema[]> {
    const roleCodes = await RoleService.getRoleCodesByUser(userId)
    const hasAllAccess = roleCodes.includes('super_admin')

    return mockFormSchemas.filter(schema => {
      if (hasAllAccess) return true
      return schema.roles.some(role => roleCodes.includes(role))
    })
  },

  async getFormSchemaById(id: string): Promise<FormSchema | undefined> {
    return mockFormSchemas.find(s => s.id === id)
  },

  async getFormSchemaByIdForUser(id: string, userId: string): Promise<FormSchema | undefined> {
    const schema = mockFormSchemas.find(s => s.id === id)
    if (!schema) return undefined
    const roleCodes = await RoleService.getRoleCodesByUser(userId)
    const hasAllAccess = roleCodes.includes('super_admin')
    if (hasAllAccess) return schema
    if (schema.roles.some(role => roleCodes.includes(role))) return schema
    return undefined
  },

  async createFormSchema(
    userId: string,
    data: {
      name: string
      description: string
      fields: FormField[]
      layout: { columns: number; labelWidth?: number }
      roles: string[]
      submitUrl?: string
    }
  ): Promise<FormSchema> {
    const canWrite = await RoleService.hasPermission(userId, 'form:write')
    if (!canWrite) {
      throw new ApiError(403, '没有创建表单的权限')
    }
    const now = Date.now()
    const schema: FormSchema = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      fields: data.fields,
      layout: data.layout,
      roles: data.roles,
      submitUrl: data.submitUrl,
      createdAt: now,
      updatedAt: now
    }
    mockFormSchemas.push(schema)
    return schema
  },

  async updateFormSchema(
    userId: string,
    id: string,
    data: Partial<Omit<FormSchema, 'id' | 'createdAt'>>
  ): Promise<FormSchema | undefined> {
    const canWrite = await RoleService.hasPermission(userId, 'form:write')
    if (!canWrite) {
      throw new ApiError(403, '没有编辑表单的权限')
    }
    const index = mockFormSchemas.findIndex(s => s.id === id)
    if (index === -1) return undefined
    mockFormSchemas[index] = { ...mockFormSchemas[index], ...data, updatedAt: Date.now() }
    return mockFormSchemas[index]
  },

  async deleteFormSchema(userId: string, id: string): Promise<boolean> {
    const canDelete = await RoleService.hasPermission(userId, 'form:delete')
    if (!canDelete) {
      throw new ApiError(403, '没有删除表单的权限')
    }
    const index = mockFormSchemas.findIndex(s => s.id === id)
    if (index === -1) return false
    mockFormSchemas.splice(index, 1)
    return true
  },

  async submitForm(userId: string, formId: string, values: Record<string, unknown>): Promise<{ id: string; formId: string; values: Record<string, unknown>; submittedAt: number; submittedBy: string }> {
    return {
      id: uuidv4(),
      formId,
      values,
      submittedAt: Date.now(),
      submittedBy: userId
    }
  }
}
