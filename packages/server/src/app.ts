import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import { config } from './config/index.js'
import { errorHandler } from './utils/response.js'
import { loggerMiddleware } from './middleware/logger.js'
import router from './routes/index.js'

const app = new Koa()

app.use(errorHandler)
app.use(loggerMiddleware)
app.use(cors(config.cors))
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(config.port, () => {
  console.log(`🚀 RBAC Gateway Server running at http://localhost:${config.port}`)
  console.log(`📋 API prefix: /api`)
  console.log(`🔑 Test accounts:`)
  console.log(`   admin    / admin123    (超级管理员)`)
  console.log(`   manager  / manager123  (部门经理)`)
  console.log(`   employee / employee123 (普通员工)`)
})

export default app
