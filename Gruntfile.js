module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('load-grunt-config')(grunt);

  grunt.registerTask('dev:start', ['nodemon:dev']);
  grunt.registerTask('default', ['availabletasks']);
}
