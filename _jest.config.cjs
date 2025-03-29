module.exports = {
    //collectCoverageFrom: ['**/*.[jt]s?(x)', '!**/*.stories.[jt]s?(x)'],
    collectCoverageFrom: ['src/*.js', '!src/_*.js'],
    testMatch: ['<rootDir>/test/*.js', '<rootDir>/test/*.test.cjs', '!<rootDir>/test/**/_*.js'],
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
          testMatch: ["**/test/*.cjs.test.js"],
        },
        {
          displayName: "ES Module",
          testEnvironment: "node",
          testMatch: ["**/test/*.test.mjs"],
          transform: {
            "^.+\\.js$": "babel-jest",
            "^.+\\.mjs$": "babel-jest"
          },
        },
        {
          displayName: "Browser",
          testEnvironment: "jsdom",
          // transform: {
          //   "^.+\\.js$": "babel-jest",
          //   "^.+\\.mjs$": "babel-jest"
          // },
          testMatch: ["**/test/*.dom.test.js", "**/test/*.browser.test.js"],
        },
      ],
};