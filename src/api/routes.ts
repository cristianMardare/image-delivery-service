import { Router } from 'express'
import { ImageRouter } from '@api/image/routes'

const router: Router = Router()

router.use('/api/image', ImageRouter)

export const AppRouter: Router = router