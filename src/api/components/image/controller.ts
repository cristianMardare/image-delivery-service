import { Request, Response } from 'express'


class ImageController {
	get = (req: Request, res: Response) => {
		res.send('image')
	}
}

export default ImageController
