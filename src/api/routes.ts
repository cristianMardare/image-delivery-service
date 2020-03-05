import { Router } from 'express'
import { ImageRouter } from './components/image/routes'

const router: Router = Router()

router.use('/api/image', ImageRouter)

export const AppRouter: Router = router