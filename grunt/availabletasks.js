module.exports = {
  tasks: {
    options: {
      filter: 'include',
      tasks: ['dev:start'],
      groups: {
        'development': ['dev:start']
      },
      descriptions: {
        'dev:start': 'Start test server.'
      }
    }
  }
}
