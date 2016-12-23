// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      { pattern: 'base.spec.ts', watched: false },
      { pattern: 'src/**/*.ts', watched: true }
    ],
    preprocessors: {
        '**/*.ts': ["karma-typescript"]
    },
    
    reporters: ["progress", "karma-typescript"],
    port: 9876,
    colors: true,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
