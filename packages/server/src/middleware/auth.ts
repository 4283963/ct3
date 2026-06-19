import { Context, Next } from 'koa'
import { verifyToken } from '../utils/jwt.js'
import { ApiError } from '../utils/response.js'

export function getTokenFromHeader(ctx: Context): string | null {
  const authHeader = ctx.headers.authorization
  if (!authHeader) return null
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null
  return parts[1]
}

export async function authMiddleware(ctx: Context, next: Next): Promise<void> {
  const token = getTokenFromHeader(ctx)
  if (!token) {
    throw new ApiError(401, '未登录或登录已过期')
  }
  try {
    const payload = verifyToken(token)
    ctx.state.user = payload
    await next()
  } catch {
    throw new ApiError(401, 'Token 无效或已过期')
  }
}

export function optionalAuthMiddleware(ctx: Context, next: Next): Promise<void> {
  const token = getTokenFromHeader(ctx)
  if (token) {
    try {
      const payload = verifyToken(token)
      ctx.state.user = payload
    } catch {
      // ignore
    }
  }
  return next()
}
