module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    files: ['**/*.spec.js'],
    preprocessors: {
      '**/*.spec.js': ['webpack']
    },
    webpack: {
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: [/node_modules/],
            use: ['babel-loader']
          }
        ]
      }
    },
    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['progress'],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: true
  })
}
