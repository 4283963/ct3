export const config = {
  port: 3001,
  jwt: {
    secret: 'rbac-gateway-secret-key-please-change-in-production',
    expiresIn: '24h'
  },
  cors: {
    origin: '*',
    credentials: true
  }
} as const

export type AppConfig = typeof config
