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

	})
})