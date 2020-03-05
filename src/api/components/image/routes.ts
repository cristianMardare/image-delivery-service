import { Router } from 'express'
import ImageController from './controller'

const router: Router = Router()
const ctrl: ImageController = new ImageController()

router.get('/', ctrl.get)

export const ImageRouter: Router = router