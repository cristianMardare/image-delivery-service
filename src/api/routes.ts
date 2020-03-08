import { Router } from 'express'
import { ImageRouter } from '@api/image/routes'
import { StatisticsRouter } from '@api/statistics/routes'

const router: Router = Router()

router.use('/api/image', ImageRouter)
router.use('/api/stats', StatisticsRouter)

export const AppRouter: Router = router