module.exports = function(grunt) {
  // Sass base
  var sassPath = 'src/theme',
    jsPath = 'src',
    appPath = jsPath + '/js';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [

          // jQuery
          jsPath + '/lib/required/jquery-1.11.1.js',

          // underscore
          jsPath + '/lib/required/underscore-min.js',

          // backbone
          jsPath + '/lib/required/backbone.dev.js',
          jsPath + '/lib/required/backbone.rpc.min.js',

          // All our enabled js
          jsPath + '/lib/enabled/*.js',

          // application js
          appPath + '/utils.js',
          appPath + '/app.js',

          // helpers
          appPath + '/helpers/*.js',

          // application models
          appPath + '/models/*.js',

          // application controllers
          appPath + '/controllers/*.js',

          // application collections - need to be loaded in order
          appPath + '/collections/xbmc.js',
          appPath + '/collections/video.js',
          appPath + '/collections/audio.js',
          appPath + '/collections/files.js',
          appPath + '/collections/pvr.js',

          // application views
          appPath + '/views/*.js',

          // addons
          appPath + '/addons/*.js'

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
      files: ['Gruntfile.js', appPath + '/*.js', appPath + '/*/*.js'],
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
    compass: {
      dist: {
        options: {
          // The path Compass will run from.
          basePath: sassPath
          // To use with bundled gems, uncomment below
          //, bundleExec: true
        }
      }
    },
    browser_sync: {
      dev: {
        bsFiles: {
          src: 'dist/theme/css/**/*.css'
        },
        options: {
          watchTask: true,
          injectChanges: true
        }
      }
    },

    // Watch tasks
    watch: {
      files: [sassPath + '/sass/**/*.scss', '<%= jshint.files %>'],
      tasks: ['compass', 'jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.registerTask('test', ['jshint']);

  // watch task (uncomment during dev)
  grunt.registerTask('default', ['browser_sync', 'watch', 'jshint', 'concat', 'uglify']);

  // build task (uncomment for build)
  grunt.registerTask('build', ['jshint', 'concat', 'uglify']);

};