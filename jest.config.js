export default {
    transform: {
        '^.+\\.ts$': 'ts-jest',
        // Removed babel-jest unless a Babel config is provided
    },
    moduleFileExtensions: ['js', 'ts', 'jsx', 'json', 'node'],
    testMatch: ['<rootDir>/tests/**/*.test.ts', '<rootDir>/tests/**/*.test.js'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
};