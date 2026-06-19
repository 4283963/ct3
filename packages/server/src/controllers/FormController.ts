import { Context } from 'koa'
import { FormService } from '../services/FormService.js'
import { success } from '../utils/response.js'
import { ApiError } from '../utils/response.js'

export const FormController = {
  async listSchemas(ctx: Context): Promise<void> {
    const { userId } = ctx.state.user as { userId: string }
    const schemas = await FormService.listFormSchemasByUser(userId)
    ctx.body = success(schemas, '获取表单列表成功')
  },

  async getSchema(ctx: Context): Promise<void> {
    const { userId } = ctx.state.user as { userId: string }
    const { id } = ctx.params as { id: string }
    const schema = await FormService.getFormSchemaByIdForUser(id, userId)
    if (!schema) {
      throw new ApiError(404, '表单不存在或无权限访问')
    }
    ctx.body = success(schema, '获取表单配置成功')
  },

  async createSchema(ctx: Context): Promise<void> {
    const { userId } = ctx.state.user as { userId: string }
    const body = ctx.request.body as Parameters<typeof FormService.createFormSchema>[1]
    const schema = await FormService.createFormSchema(userId, body)
    ctx.body = success(schema, '创建表单成功')
  },

  async updateSchema(ctx: Context): Promise<void> {
    const { userId } = ctx.state.user as { userId: string }
    const { id } = ctx.params as { id: string }
    const body = ctx.request.body as Parameters<typeof FormService.updateFormSchema>[2]
    const schema = await FormService.updateFormSchema(userId, id, body)
    if (!schema) {
      throw new ApiError(404, '表单不存在')
    }
    ctx.body = success(schema, '更新表单成功')
  },

  async deleteSchema(ctx: Context): Promise<void> {
    const { userId } = ctx.state.user as { userId: string }
    const { id } = ctx.params as { id: string }
    const ok = await FormService.deleteFormSchema(userId, id)
    if (!ok) {
      throw new ApiError(404, '表单不存在')
    }
    ctx.body = success(null, '删除表单成功')
  },

  async submitForm(ctx: Context): Promise<void> {
    const { userId } = ctx.state.user as { userId: string }
    const { id } = ctx.params as { id: string }
    const values = ctx.request.body as Record<string, unknown>
    const result = await FormService.submitForm(userId, id, values)
    ctx.body = success(result, '提交成功')
  }
}
