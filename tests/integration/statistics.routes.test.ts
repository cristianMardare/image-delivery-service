import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import request from 'supertest'
import { promisify} from 'util'

import { pathFromRoot } from '@services/utils'
import { server } from '../../src/api/server'
import { StatisticsService } from '@services/statistics'

global.__basedir = path.join(__dirname, '../..')
const unlink = promisify(fs.unlink)
const IMAGE_ROUTE = '/api/image'
const STATS_ROUTE = '/api/stats'

describe('GET /api/statistics', () => {
	const ORIGINAL_FILE_NAME = "file.png"
	const ORIGINAL_FILE_PATH = pathFromRoot('repository', ORIGINAL_FILE_NAME)

	const RESIZED_FILE_NAME = "file_10_10.png"
	const RESIZED_FILE_PATH = pathFromRoot('cache', RESIZED_FILE_NAME)

	beforeEach(() => {
		StatisticsService.getInstance().watch(pathFromRoot('repository'), 'original_file_count')
		StatisticsService.getInstance().watch(pathFromRoot('cache'), 'resized_file_count')
	})

	beforeEach(() => {
		 return sharp(ORIGINAL_FILE_NAME, {
			create: {
			  width: 100,
			  height: 100,
			  channels: 4,
			  background: { r: 255, g: 0, b: 0, alpha: 0.5 }
			}
		      })
		      .toFile(ORIGINAL_FILE_PATH)
	})

	test('should update cache misses on every non-cached resize call', async () => {
		let path = `${IMAGE_ROUTE}/${ORIGINAL_FILE_NAME}?size=10x10`
		await request(server)
			.get(path)

		const res = await request(server)
				.get(STATS_ROUTE)

		expect(res.status).toEqual(200)
		expect(res.body.cache_misses).toEqual(1)
	})

	test('should update cache hits on every cached resize call', async () => {
		let path = `${IMAGE_ROUTE}/${ORIGINAL_FILE_NAME}?size=10x10`
		await request(server)
			.get(path)

		await request(server)
			.get(path)

		const res = await request(server)
				.get(STATS_ROUTE)

		expect(res.status).toEqual(200)
		expect(res.body.cache_hits).toEqual(1)
	})

	test('should update resized_file_count on every new resize', async () => {
		let path = `${IMAGE_ROUTE}/${ORIGINAL_FILE_NAME}?size=10x10`
		var initialSize = -1
		var finalSize = -1

		{
			const res = await request(server)
				.get(STATS_ROUTE)

			initialSize = res.body.resized_file_count
		}
		

		await request(server)
			.get(path)

		{
			const res = await request(server)
				.get(STATS_ROUTE)

			finalSize = res.body.resized_file_count
		}
		
		expect(initialSize).toEqual(0)
		expect(finalSize).toEqual(1)
	})

	afterEach(() => {
		StatisticsService.getInstance()._flush()
	})

	afterEach(async () => {
		try{
			await Promise.all([
				unlink(ORIGINAL_FILE_PATH),
				unlink(RESIZED_FILE_PATH)
			]) 
			
		}
		catch(err){
			// ignore error	
		}
	})

	afterAll(() => {
		StatisticsService.getInstance()._close()
	})
})