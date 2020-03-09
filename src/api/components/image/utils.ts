import { Request } from 'express'
import path from 'path'
import sanitize from 'sanitize-filename'

import { IResizeOptions, IGetImageRequest } from '@api/image/model'

export class RequestParsers {
	static getImage = function(req: Request) : IGetImageRequest {
		var file: string | undefined = req.params.file || req.query.file || undefined
		var size: string | undefined = req.query.size || undefined

		if (!file)
			return undefined

		file = sanitize(path.basename(file))	// ensure file does not contain folder path and illegal characters
		const { ext: extension, name } = path.parse(file)	// extract file extension (e.g. .png) and file name without extension

		return {
			file,
			extension,
			name,
			options: ParameterParsers.parseSize(size)
		} 
	}
}

export class ParameterParsers {
	static parseSize = function (size: any): IResizeOptions {
		if (typeof(size) !== 'string')
			return undefined
			
		const [w, h] = size.split('x')
	
		let height = Number.parseInt(h)
		let width = Number.parseInt(w)
	
		if (Object.is(height, NaN) || Object.is(width, NaN))
			return undefined		// parsing failed, no resizing options
	
		return {
			height,
			width
		}
	}
}
