export default {
    transform: {
        '^.+\\.mjs$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx', 'mjs'],
    testMatch: ['<rootDir>/tests/**/*.test.mjs']
};