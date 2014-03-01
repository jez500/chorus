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
          'src/lib/required/jquery-1.10.2.js',

          // underscore
          'src/lib/required/underscore-min.js',

          // backbone
          'src/lib/required/backbone.dev.js',
          'src/lib/required/backbone.rpc.min.js',

          // All our enabled js
          'src/lib/enabled/*.js',

          // application js
          'src/js/utils.js',
          'src/js/app.js',

          // helpers
          'src/js/helpers/*.js',

          // application models
          'src/js/models/*.js',

          // application controllers
          'src/js/controllers/*.js',

          // application collections - need to be loaded in order
          'src/js/collections/xbmc.js',
          'src/js/collections/video.js',
          'src/js/collections/audio.js',
          'src/js/collections/files.js',


          // application views
          'src/js/views/*.js'

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
      files: ['Gruntfile.js', 'src/js/*.js', 'src/js/*/*.js'],
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