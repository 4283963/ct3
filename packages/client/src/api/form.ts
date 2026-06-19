import { get, post, put, del } from '@/utils/request'
import type { FormSchema } from '@/types'

export const formApi = {
  listSchemas: () => get<FormSchema[]>('/api/forms'),
  getSchema: (id: string) => get<FormSchema>(`/api/forms/${id}`),
  createSchema: (data: Partial<FormSchema>) => post<FormSchema>('/api/forms', data),
  updateSchema: (id: string, data: Partial<FormSchema>) => put<FormSchema>(`/api/forms/${id}`, data),
  deleteSchema: (id: string) => del<null>(`/api/forms/${id}`),
  submitForm: (id: string, values: Record<string, unknown>) =>
    post<{ id: string; formId: string; values: Record<string, unknown> }>(`/api/forms/${id}/submit`, values)
}
