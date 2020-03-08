import { Router } from 'express'
import StatisticsController from '@api/statistics/controller'

const router: Router = Router()
const ctrl: StatisticsController = new StatisticsController()

router.get('/', ctrl.get)

export const StatisticsRouter: Router = router