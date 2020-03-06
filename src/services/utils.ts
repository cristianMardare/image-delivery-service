import { IResizeOptions } from '@api/image/model'

export function parseSize(size: any): IResizeOptions {
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