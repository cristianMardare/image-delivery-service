import { pathFromRoot } from '@services/utils'
import path from 'path'

describe('utils', () => {
	describe('pathFromRoot', () => {
		const ROOT = '/var/src'
		beforeAll(() => {
			global.__basedir = ROOT
		})

		test('should return ROOT if no arguments are passed', () => {
			const actual = pathFromRoot()
			const expected = path.join(ROOT)

			expect(actual).toEqual(expected)
		})

		test('should concatenate given folder to ROOT if one folder is given', () => {
			const FOLDER = 'folder'
			const actual = pathFromRoot(FOLDER)
			const expected = path.join(ROOT, FOLDER)

			expect(actual).toEqual(expected)
		})

		test('should concatenate all folders to ROOT if multiple folders are given as an array', () => {
			const FOLDERS = ['folder1', 'folder2']
			const actual = pathFromRoot(...FOLDERS)
			const expected = path.join(ROOT, ...FOLDERS)

			expect(actual).toEqual(expected)
		})

		test('should ignore undefined components', () => {
			const FOLDERS = ['folder1', undefined]
			const actual = pathFromRoot(...FOLDERS)
			const expected = path.join(ROOT, 'folder1')

			expect(actual).toEqual(expected)
		})

		test('should ignore null components', () => {
			const FOLDERS = ['folder1', null]
			const actual = pathFromRoot(...FOLDERS)
			const expected = path.join(ROOT, 'folder1')

			expect(actual).toEqual(expected)
		})

		test('should flatten array components', () => {
			const FOLDERS = ['folder1', ['folder2', 'folder3']]
			const actual = pathFromRoot(...FOLDERS)
			const expected = path.join(ROOT, 'folder1', 'folder2', 'folder3')

			expect(actual).toEqual(expected)
		})

		test('should flatten objects and concatenate its\' property values', () => {
			const FOLDERS = Object.assign({ 
					'first':'folder1',
					'second': 'folder2',
					'third': 'folder3'
				})
			const actual = pathFromRoot(FOLDERS)
			const expected = path.join(ROOT, 'folder1', 'folder2', 'folder3')

			expect(actual).toEqual(expected)
		})

		test('should concatenate numbers as components', () => {
			const FOLDER = 1
			const actual = pathFromRoot(FOLDER)
			const expected = path.join(ROOT, '1')

			expect(actual).toEqual(expected)
		})

	})
})