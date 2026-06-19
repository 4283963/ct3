import Router from 'koa-router'
import { AuthController } from '../controllers/AuthController.js'
import { RouteController } from '../controllers/RouteController.js'
import { FormController } from '../controllers/FormController.js'
import { UserController } from '../controllers/UserController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = new Router({ prefix: '/api' })

router.post('/auth/login', AuthController.login)
router.get('/auth/me', authMiddleware, AuthController.me)

router.get('/routes', authMiddleware, RouteController.getUserRoutes)
router.get('/routes/all', authMiddleware, RouteController.listAllRoutes)

router.get('/forms', authMiddleware, FormController.listSchemas)
router.get('/forms/:id', authMiddleware, FormController.getSchema)
router.post('/forms', authMiddleware, FormController.createSchema)
router.put('/forms/:id', authMiddleware, FormController.updateSchema)
router.delete('/forms/:id', authMiddleware, FormController.deleteSchema)
router.post('/forms/:id/submit', authMiddleware, FormController.submitForm)

router.get('/users', authMiddleware, UserController.listUsers)
router.get('/roles', authMiddleware, UserController.listRoles)
router.get('/permissions', authMiddleware, UserController.listPermissions)

export default router
