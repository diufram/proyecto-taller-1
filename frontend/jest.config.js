module.exports = {
    displayName: 'frontend',
    rootDir: '.',
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testEnvironmentOptions: {
        customExportConditions: ['node'],
    },
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/src/**/*.spec.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/app/$1',
        '^@testing/(.*)$': '<rootDir>/src/testing/$1',
        '\\.(css|scss|sass|less)$': '<rootDir>/src/testing/style-mock.js',
    },
    transformIgnorePatterns: [
        'node_modules/(?!.*\\.mjs$|@angular|rxjs|tslib|@primeuix|primeng)',
    ],
    coverageDirectory: '<rootDir>/coverage',
    collectCoverageFrom: ['src/app/**/*.ts', '!src/app/**/*.module.ts'],
};