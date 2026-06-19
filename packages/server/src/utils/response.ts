import { Context, Next } from 'koa'

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T | null
}

export class ApiError extends Error {
  public code: number
  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.name = 'ApiError'
  }
}

export function success<T>(data: T, message = 'ok'): ApiResponse<T> {
  return { code: 0, message, data }
}

export function fail(code: number, message: string): ApiResponse<null> {
  return { code, message, data: null }
}

export async function errorHandler(ctx: Context, next: Next): Promise<void> {
  try {
    await next()
  } catch (err) {
    if (err instanceof ApiError) {
      ctx.body = fail(err.code, err.message)
      ctx.status = 200
    } else {
      const error = err as Error
      ctx.body = fail(500, error.message || 'Internal Server Error')
      ctx.status = 500
    }
  }
}

export function responseFormatter(ctx: Context, next: Next): Promise<void> {
  return next()
}
