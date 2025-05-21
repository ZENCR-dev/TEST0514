/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // if you have a setup file
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    // Use ts-jest for ts/tsx files
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // tsconfig: 'tsconfig.json', // Keep your global tsconfig
        tsconfig: { // Override specific options for Jest
          jsx: 'react-jsx',
          // Add other overrides if necessary, e.g., esModuleInterop if not in global tsconfig
        }
      },
    ],
  },
  // Ignore Next.js build directory
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
}; 