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
          'dev/lib/required/jquery-1.10.2.js',

          // underscore
          'dev/lib/required/underscore-min.js',

          // backbone
          'dev/lib/required/backbone.dev.js',
          'dev/lib/required/backbone.rpc.min.js',

          // All our enabled js
          'dev/lib/enabled/*.js',

          // application js
          'dev/js/utils.js',
          'dev/js/app.js',

          // application models
          'dev/js/models/*.js',

          // application controllers
          'dev/js/controllers/*.js',

          // application collections - need to be loaded in order
          'dev/js/collections/xbmc.js',
          'dev/js/collections/audio.js',
          'dev/js/collections/files.js',
          'dev/js/collections/video.js',

          // application views
          'dev/js/views/*.js'

        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> by Jeremy Graham - built on <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'dev/js/*.js', 'dev/js/*/*.js'],
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