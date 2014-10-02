module.exports = {
  dev: {
    script: 'test.js',
    options: {
      args: ['dev'],
      nodeArgs: ['--debug'],
      ext: 'js',
      watch: [
        'lib'
      ]
    }
  }
}
