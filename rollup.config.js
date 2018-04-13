const babel = require('rollup-plugin-babel')

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/imageupload.js',
    name: 'ImageUpload',
    format: 'umd'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
