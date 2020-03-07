import request from 'supertest'
import path from 'path'
import sharp from 'sharp'
import fs from 'fs'
import { promisify } from 'util'

import { server } from '../../src/api/server'

global.__basedir = path.join(__dirname, '../..')

const binaryParser = function (res, cb) {
	res.setEncoding("binary");
	res.data = "";
	res.on("data", function (chunk) {
	  res.data += chunk;
	});
	res.on("end", function () {
	  cb(null, new Buffer(res.data, "binary"));
	});
      };

const unlink = promisify(fs.unlink)

describe('GET /api/image', () => {
	const ROUTE = '/api/image'
	describe('with no file name in the path or query string', () => {
		test('should return 400 Bad Request', async () => {
			await request(server)
				.get(ROUTE)
				.expect(400)
		})
	})
	
	describe('with file name pointing to non existing file', () => {
		test('should return 404 Not Found (file name as part of path)', async () => {
			let path = `${ROUTE}/missing_file.jpg`
			await request(server)
				.get(path)
				.expect(404)
		})

		test('should return 404 Not Found (file name as query string parameter)', async () => {
			let path = `${ROUTE}?file=missing_file.jpg`
			await request(server)
				.get(path)
				.expect(404)
		})
	})

	describe('with file name pointing to existing file', () => {
		var FILE_PATH = 'N/A'
		var FILE_NAME_NO_EXT = 'test_file'
		var EXTENSIONS = {
			PNG: 'png',
			JPG: 'jpg'
		}
		var FILE_NAME = `${FILE_NAME_NO_EXT}.${EXTENSIONS.PNG}`

		const DEFAULT_WIDTH = 110
		const DEFAULT_HEIGHT = 100
		const DEFAULT_CHANNELS = 4

		beforeAll(() => {
			FILE_PATH = path.join(global.__basedir, 'repository', FILE_NAME)
		})

		beforeEach(() => {
			return sharp(FILE_NAME, {
				create: {
				  width: DEFAULT_WIDTH,
				  height: DEFAULT_HEIGHT,
				  channels: DEFAULT_CHANNELS,
				  background: { r: 255, g: 0, b: 0, alpha: 0.5 }
				}
			      })
			      .toFile(FILE_PATH)
		})

		test('should successfully return original file contents (file name as part of path)', async () => {
			let path = `${ROUTE}/${FILE_NAME}`
			const resp = await request(server)
						.get(path)
						.buffer()
						.parse(binaryParser)

			expect(resp.status).toEqual(200)

			let meta = await sharp(resp.body).metadata()
			expect(meta.width).toEqual(DEFAULT_WIDTH)
			expect(meta.height).toEqual(DEFAULT_HEIGHT)
			expect(meta.format).toEqual(EXTENSIONS.PNG)
		})

		test('should successfully return original file contents (file name as query string parameter)', async () => {
			let path = `${ROUTE}?file=${FILE_NAME}`
			const resp = await request(server)
						.get(path)
						.buffer()
						.parse(binaryParser)

			expect(resp.status).toEqual(200)
			
			let meta = await sharp(resp.body).metadata()
			expect(meta.width).toEqual(DEFAULT_WIDTH)
			expect(meta.height).toEqual(DEFAULT_HEIGHT)
			expect(meta.format).toEqual(EXTENSIONS.PNG)
		})

		describe('given new valid size', () => {
			const resizeBy = 0.5
			const NEW_WIDTH = resizeBy * DEFAULT_WIDTH
			const NEW_HEIGHT = resizeBy * DEFAULT_HEIGHT

			test('should successfully return resized file (file name as query string parameter)', async () => {
				let path = `${ROUTE}?file=${FILE_NAME}&size=${NEW_WIDTH}x${NEW_HEIGHT}`

				const resp = await request(server)
						.get(path)
						.buffer()
						.parse(binaryParser)

				expect(resp.status).toEqual(200)

				let meta = await sharp(resp.body).metadata()
				expect(meta.width).toEqual(NEW_WIDTH)
				expect(meta.height).toEqual(NEW_HEIGHT)
				expect(meta.format).toEqual(EXTENSIONS.PNG)
			})

			afterEach(async () => {
				const resizedFilePath = path.join(global.__basedir, 'repository', `${FILE_NAME_NO_EXT}_${NEW_WIDTH}_${NEW_HEIGHT}.${EXTENSIONS.PNG}`)
				try{
					await unlink(resizedFilePath)
				}
				catch(err){
					// ignore error	
				}
			}) 
		})

		afterEach(async () => {
			try{
				await unlink(FILE_PATH)
			}
			catch(err){
				// ignore error	
			}
		})
	})
})
