import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

import { StatisticsService } from '@services/statistics'

describe('StatisticsService', () => {
	test('should be a singleton', () => {
		let instance1 = StatisticsService.getInstance()
		let instance2 = StatisticsService.getInstance()

		expect(instance1).toBe(instance2)
	})

	describe('cacheHit', () => {
		test('should increase the value of cache_hits by 1', () => {
			let initial = StatisticsService.getInstance().get().cache_hits

			StatisticsService.getInstance().cacheHit()

			let final = StatisticsService.getInstance().get().cache_hits
			const diff = final - initial

			expect(diff).toEqual(1)
		})
	})

	describe('cacheMiss', () => {
		test('should increase the value of cache_misses by 1', () => {
			let initial = StatisticsService.getInstance().get().cache_misses

			StatisticsService.getInstance().cacheMiss()

			let final = StatisticsService.getInstance().get().cache_misses
			const diff = final - initial

			expect(diff).toEqual(1)
		})
	})

	describe('watch', () => {
		const FOLDER = 'TMP'
		const FILE_NAME = '1.jpg'
		const FILE_PATH = path.join(FOLDER, FILE_NAME)
		beforeEach(() => {
			fs.mkdirSync(FOLDER)
			return sharp(FILE_NAME, {
				create: {
				  width: 50,
				  height: 50,
				  channels: 4,
				  background: { r: 255, g: 0, b: 0, alpha: 0.5 }
				}
			      })
			      .toFile(FILE_PATH)
		})

		test('should ignore undefined folders', () => {
			expect(() => {
				StatisticsService.getInstance().watch(undefined, 'test')
			}).not.toThrow()

			let actualStats = StatisticsService.getInstance().get()
			expect(actualStats['test']).toBeUndefined()
			
		})

		test('should ignore null folders', () => {
			expect(() => {
				StatisticsService.getInstance().watch(undefined, 'test')
			}).not.toThrow()

			let actualStats = StatisticsService.getInstance().get()
			expect(actualStats['test']).toBeUndefined()
			
		})

		test('should ignore missing folders', () => {
			expect(() => {
				StatisticsService.getInstance().watch('missing', 'test')
			}).not.toThrow()

			let actualStats = StatisticsService.getInstance().get()
			expect(actualStats['test']).toBeUndefined()
			
		})

		describe('when created', () => {
			test('should update number of files in folder', () => {
				StatisticsService.getInstance().watch(FOLDER, 'test')
				let stats = StatisticsService.getInstance().get()
				let actualCount = stats['test']
	
				expect(actualCount).toEqual(1)
			})

			test('should create a property in statistics based on the provided label', () => {
				const label = 'label'
				StatisticsService.getInstance().watch(FOLDER, label)
				let stats = StatisticsService.getInstance().get()
	
				expect(stats[label]).toEqual(1)
			})

			test('should create a property in statistics based on the watched folder if no label is provided', () => {
				const label = 'label'
				StatisticsService.getInstance().watch(FOLDER)
				let stats = StatisticsService.getInstance().get()
	
				expect(stats[FOLDER]).toEqual(1)
			})
		})


		afterEach(() => {
			StatisticsService.getInstance()._close()
			fs.rmdirSync(FOLDER, { recursive: true })
		})
	})

	afterEach(() => {
		StatisticsService.getInstance()._flush()
	})
})