export default {
    //collectCoverageFrom: ['**/*.[jt]s?(x)', '!**/*.stories.[jt]s?(x)'],
    collectCoverageFrom: ['src/*.js', '!src/_*.js'],
    // testMatch: ['<rootDir>/test/*.js', '<rootDir>/test/*.test.cjs', '!<rootDir>/test/**/_*.js'],
    // testEnvironment: "@bufbuild/jest-environment-jsdom",
    /*
    coverageThreshold: {
        './src/': {
          statements: 95,
          branches: 90,
          functions: 95,
          lines: 90,
        },
      },
    */
      projects: [
        {
          displayName: "CommonJS",
          testEnvironment: "node",
          testMatch: ["**/test/*.test.cjs"],
        },
        {
          displayName: "ES Module",
          testEnvironment: "node",
          testMatch: ["**/test/*.test.js", "**/test/*.test.mjs"],
          // transform: {
          //   "^.+\\.js$": "babel-jest",
            // "^.+\\.mjs$": "babel-jest"
          // },
        },
        {
          displayName: "Browser",
          testEnvironment: "jsdom",
          transform: {
            "^.+\\.js$": "babel-jest",
          //   "^.+\\.mjs$": "babel-jest"
          },
          testMatch: ["**/test/*.test.browser.cjs"],
        },
      ],
};