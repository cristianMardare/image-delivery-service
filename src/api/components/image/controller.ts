import { Request, Response } from 'express'
import { promisify } from 'util'
import fs from 'fs'
import sharp from 'sharp'

import { RequestParsers } from '@api/image/utils'
import { ImageLocator } from '@services/image-locator'
import { pathFromRoot } from '@services/utils'

 
const stat = promisify(fs.stat)

class ImageController {
	get =  async (req: Request, res: Response) => { 

		const {
			file: originalFileNameWithExt,
			extension: originalExtension,
			name: originalFileName,
			options
		} = RequestParsers.getImage(req) ?? {}

		if (!originalFileNameWithExt){
			return process.nextTick(() => res
							.status(400)
							.send('Invalid file name'))
		}

		const repoLocator = new ImageLocator(pathFromRoot('repository'))

		if (!await repoLocator.exists(originalFileNameWithExt))
			return res.status(404)
					.send(`File ${originalFileNameWithExt} does not exist`)
		

		const shouldResize = typeof(options) !== 'undefined'

		if (!shouldResize)
			return repoLocator
					.read(originalFileNameWithExt)
					.pipe(res)

		const cacheLocator = new ImageLocator(pathFromRoot('cache'))
		let newFileNameWithExt = `${originalFileName}_${options.width}_${options.height}${originalExtension}`
		
		if (await cacheLocator.exists(newFileNameWithExt)){
			res.header('x-cache', 'HIT')
			return cacheLocator
					.read(newFileNameWithExt)
					.pipe(res)
		}else {
			let pipeline = repoLocator
						.read(originalFileNameWithExt)
						.pipe(sharp().resize(options))

			// pipe in caching
			pipeline.clone().pipe(cacheLocator.write(newFileNameWithExt))

			// finally pipe in the response to the resizing transformation stream
			res.header('x-cache', 'MISS')
			return pipeline.pipe(res)
		}
	}

}



export default ImageController
