import { Request, Response } from 'express'


class ImageController {
	get = async (req: Request, res: Response) => {
		var file: string | undefined = req.params.file || req.query.file || undefined

		if (!file){
			return process.nextTick(() => res
							.status(400)
							.send('Invalid file name'))
		}

		res.send(file)
	}
}

export default ImageController
