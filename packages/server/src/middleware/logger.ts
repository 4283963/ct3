import { Context, Next } from 'koa'

export function loggerMiddleware(ctx: Context, next: Next): Promise<void> {
  const start = Date.now()
  const method = ctx.method
  const url = ctx.url
  console.log(`[${new Date().toISOString()}] ${method} ${url} - start`)
  return next().then(() => {
    const duration = Date.now() - start
    const status = ctx.status
    console.log(`[${new Date().toISOString()}] ${method} ${url} - ${status} - ${duration}ms`)
  })
}
