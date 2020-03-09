import { Request } from 'express'
import path from 'path'

import { ParameterParsers, RequestParsers } from '@api/image/utils'

describe('RequestParsers', () => {
	describe('getImage', () => {
		test('should extract file name from path', () => {
			const FILE_NAME = 'file_name'
			const request: Request = mockRequest({
				params: {
					'file': FILE_NAME
				}
			}) 

			const actualOutput = RequestParsers.getImage(request)

			expect(actualOutput.file).toEqual(FILE_NAME)
		})

		test('should extract file name from query string parameter', () => {
			const FILE_NAME = 'file_name'
			const request: Request = mockRequest({
				query: {
					'file': FILE_NAME
				}
			}) 

			const actualOutput = RequestParsers.getImage(request)

			expect(actualOutput.file).toEqual(FILE_NAME)
		})

		test('should extract file extension from valid file name', () => {
			const EXTENSION = '.ext'
			const FILE_NAME = `file_name${EXTENSION}`
			const request: Request = mockRequest({
				params: {
					'file': FILE_NAME
				}
			}) 

			const actualOutput = RequestParsers.getImage(request)

			expect(actualOutput.extension).toEqual(EXTENSION)
		})

		test('should extract file name (without extension) from valid file name', () => {
			const EXTENSION = '.ext'
			const NAME = 'file_name'
			const FILE_NAME = `${NAME}${EXTENSION}`
			const request: Request = mockRequest({
				params: {
					'file': FILE_NAME
				}
			}) 

			const actualOutput = RequestParsers.getImage(request)

			expect(actualOutput.name).toEqual(NAME)
		})

		test('should ignore folder path when extracting file name', () => {
			const EXTENSION = '.ext'
			const NAME = 'file_name'
			const FOLDER = 'path/to/'
			const FILE_NAME = `${FOLDER}${NAME}${EXTENSION}`
			const request: Request = mockRequest({
				params: {
					'file': FILE_NAME
				}
			}) 

			const actualOutput = RequestParsers.getImage(request)

			expect(actualOutput.file).toEqual(`${NAME}${EXTENSION}`)
		})

		test('should remove illegal characters when extracting file name', () => {
			const ILLEGAL_CHARACTERS = ['>','<',':','"','/','\\','|',"?","*"]
			const NAME = 'file_name'
			const FILE_NAME = path.join(...ILLEGAL_CHARACTERS, NAME)
			const request: Request = mockRequest({
				params: {
					'file': FILE_NAME
				}
			}) 

			const actualOutput = RequestParsers.getImage(request)

			expect(actualOutput.file).toEqual(NAME)
		})

		test('should return undefined if file name cannot be extracted', () => {
			const request: Request = mockRequest()
			const actualOutput = RequestParsers.getImage(request)

			expect(actualOutput).toEqual(undefined)
		})

		test('should return undefined resize options when size parameter is missing', () => {
			const FILE_NAME = 'file_name.png'
			const request: Request = mockRequest({
				params: {
					'file': FILE_NAME
				}
			}) 
			const actualOutput = RequestParsers.getImage(request)

			expect(actualOutput.options).toEqual(undefined)
		})

		test('should parse a correctly formatted size parameter', () => {
			const FILE_NAME = 'file_name.png'
			const WIDTH = 50
			const HEIGHT = 100
			const SIZE = `${WIDTH}x${HEIGHT}`
			const request: Request = mockRequest({
				params: {
					'file': FILE_NAME
				},
				query: {
					size: SIZE
				}
			}) 
			const actualOutput = RequestParsers.getImage(request)

			expect(actualOutput.options.width).toEqual(WIDTH)
			expect(actualOutput.options.height).toEqual(HEIGHT)
		})

		
	})
})

describe('ParameterParsers',() => {
	describe('parseSize', () => {
		test('should parse a correctly formatted size parameter', () => {
			const WIDTH = 50
			const HEIGHT = 100
			const SIZE = `${WIDTH}x${HEIGHT}`

			const actualOutput = ParameterParsers.parseSize(SIZE)

			expect(actualOutput.width).toEqual(WIDTH)
			expect(actualOutput.height).toEqual(HEIGHT)
		})

		test('should return undefined resize options if size is missing the "x" separator', () => {
			const WIDTH = 50
			const HEIGHT = 100
			const SIZE = `${WIDTH};${HEIGHT}`

			const actualOutput = ParameterParsers.parseSize(SIZE)

			expect(actualOutput).toEqual(undefined)
		})

		test('should return undefined resize options if size is missing the width dimension', () => {
			const WIDTH = 50
			const HEIGHT = 100
			const SIZE = `x${HEIGHT}`

			const actualOutput = ParameterParsers.parseSize(SIZE)

			expect(actualOutput).toEqual(undefined)
		})

		test('should return undefined resize options if size is missing the height dimension', () => {
			const WIDTH = 50
			const HEIGHT = 100
			const SIZE = `${WIDTH}x`

			const actualOutput = ParameterParsers.parseSize(SIZE)

			expect(actualOutput).toEqual(undefined)
		})

		test('should return undefined resize options if size has an invalid numeric width', () => {
			const WIDTH = 'a'
			const HEIGHT = 100
			const SIZE = `${WIDTH}x${HEIGHT}`

			const actualOutput = ParameterParsers.parseSize(SIZE)

			expect(actualOutput).toEqual(undefined)
		})
		
		test('should return undefined resize options if size has an invalid numeric height', () => {
			const WIDTH = 50
			const HEIGHT = 'a'
			const SIZE = `${WIDTH}x${HEIGHT}`

			const actualOutput = ParameterParsers.parseSize(SIZE)

			expect(actualOutput).toEqual(undefined)
		})

		test('should return undefined if size has more than 2 dimensions', () => {
			const WIDTH = 50
			const HEIGHT = 'a'
			const SIZE = `${WIDTH}x${HEIGHT}x200`
 
			const actualOutput = ParameterParsers.parseSize(SIZE)

			expect(actualOutput).toEqual(undefined)
		})
	})
})

function mockRequest(overrides?: any) : Request {
	const template: Request = {
			params: {
			},
			query: {
			} 
		} as any as Request
	 
	return Object.assign(template, overrides)
}