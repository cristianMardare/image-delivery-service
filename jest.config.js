module.exports = {
	clearMocks: true,
	coveragePathIgnorePatterns: [
	  '<rootDir>/node_modules/(?!@foo)',
	],
	globals: {
	  'ts-jest': {
	    diagnostics: {
	      warnOnly: true,
	    },
	    tsConfig: 'tsconfig.json',
	  },
	},
	moduleFileExtensions: [
	  'js',
	  'ts',
	  'tsx',
	],
	moduleNameMapper: {
	  '@api/(.*)': '<rootDir>/src/api/components/$1',
	  '@services/(.*)': '<rootDir>/src/services/$1',
	},
	testEnvironment: 'node',
	testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
	transform: {
	  '^.+\\.(ts|tsx)$': 'ts-jest',
	},
	transformIgnorePatterns: [
	  '<rootDir>/node_modules/(?!@foo)',
	],
	preset: 'ts-jest',
	testMatch: null,
      }