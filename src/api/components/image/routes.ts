import { Router } from 'express'
import ImageController from '@api/image/controller'

const router: Router = Router()
const ctrl: ImageController = new ImageController()

router.get('/:file?', ctrl.get)

export const ImageRouter: Router = router