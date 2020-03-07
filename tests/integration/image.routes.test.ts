import request from 'supertest'
import path from 'path'
import sharp from 'sharp'
import fs from 'fs'

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
		var FILE_NAME = 'test_file.png'

		const DEFAULT_WIDTH = 110
		const DEFAULT_HEIGHT = 100
		const DEFAULT_CHANNELS = 4

		beforeAll(() => {
			FILE_PATH = path.join(global.__basedir, 'repository', FILE_NAME)
		})

		beforeEach((done) => {
			sharp(FILE_NAME, {
				create: {
				  width: DEFAULT_WIDTH,
				  height: DEFAULT_HEIGHT,
				  channels: DEFAULT_CHANNELS,
				  background: { r: 255, g: 0, b: 0, alpha: 0.5 }
				}
			      })
			      .pipe(fs.createWriteStream(FILE_PATH))
			      .on('finish', done)
			      .on('error', done)
		})

		test('should successfully return original file contents (file name as part of path)', async () => {
			let path = `${ROUTE}/${FILE_NAME}`
			const resp = await request(server)
						.get(path)
						.buffer()
						.parse(binaryParser)

			expect(resp.status).toEqual(200)
			expect(resp.body.length).toEqual(DEFAULT_WIDTH*DEFAULT_HEIGHT*DEFAULT_CHANNELS)
		})

		test('should successfully return original file contents (file name as query string parameter)', async () => {
			let path = `${ROUTE}?file=${FILE_NAME}`
			const resp = await request(server)
						.get(path)
						.buffer()
						.parse(binaryParser)

			expect(resp.status).toEqual(200)
			expect(resp.body.length).toEqual(DEFAULT_WIDTH*DEFAULT_HEIGHT*DEFAULT_CHANNELS)
		})

		afterEach((done) => {
			console.log('unlink')
			fs.unlink(FILE_PATH, done)
		})
	})
})
