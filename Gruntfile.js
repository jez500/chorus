module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [

          // jQuery
          'lib/required/jquery-1.10.2.js',

          // underscore
          'lib/required/underscore-min.js',

          // backbone
          'lib/required/backbone.dev.js',
          'lib/required/backbone.rpc.min.js',

          // All our enabled js
          'lib/enabled/*.js',

          // application js
          'js/utils.js',
          'js/app.js',

          // application models
          'js/models/*.js',

          // application controllers
          'js/controllers/*.js',

          // application collections - need to be loaded in order
          'js/collections/xbmc.js',
          'js/collections/audio.js',
          'js/collections/files.js',

          // application views
          'js/views/*.js'

        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};