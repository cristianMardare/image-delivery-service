export interface IResizeOptions {
	height: number
	width: number
}

export interface IGetImageRequest {
	file: string	
	extension: string
	name: string
	options: IResizeOptions
}