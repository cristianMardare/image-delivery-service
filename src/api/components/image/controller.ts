import { Request, Response } from 'express'
import path from 'path'
import { promisify } from 'util'
import fs from 'fs'
import sharp from 'sharp'
import stream from 'stream'

import { IResizeOptions } from '@api/image/model'
import { parseSize } from '@services/utils'

 
const stat = promisify(fs.stat)

class ImageController {
	get = async (req: Request, res: Response) => {
		var file: string | undefined = req.params.file || req.query.file || undefined
		var size = req.query.size || undefined

		if (!file){
			return process.nextTick(() => res
							.status(400)
							.send('Invalid file name'))
		}

		const options: IResizeOptions = parseSize(size)

		{
			let originalFileName = path.basename(file)	// filename including extension
			let fileName = originalFileName
			
			if (typeof(options) !== 'undefined'){
				let ext = path.extname(file)
				let fileWithoutExtension = path.basename(file, ext)

				fileName = `${fileWithoutExtension}_${options.width}_${options.height}${ext}`
			}
			
			let pathToFile = path.join(global.__basedir, 'repository', fileName)
			let cached = false

			try {
				await stat(pathToFile)
				cached = true
			} catch(err){
				
				if (!options)	// no resize options means original file
					return res.status(404)
							.send(`File ${fileName} does not exist`)

				// file does not exist in cache, create it and cache it afterwards
				{
					let pathToOriginalFile = path.join(global.__basedir, 'repository', originalFileName)
					let resizer = sharp().resize(options)
					let resizingStream = fs.createReadStream(pathToOriginalFile)
						.pipe(resizer)
					
					// pipe in caching
					resizingStream.pipe(              
						new stream.PassThrough().pipe(
							fs.createWriteStream(pathToFile)
					      ))

					// finally pipe in the response to the resizing transformation stream
					return resizingStream.pipe(res)
				}
				
			}

			if (cached){
				fs.createReadStream(pathToFile)
					.pipe(res)
			}
		}
	}
}

export default ImageController
