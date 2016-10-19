module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
          html: {
            expand: true,
            src: 'index.html',
            dest: 'dist/',
          },
          babel: {
            expand: true,
            cwd: "node_modules/babel-polyfill/dist/",
            src: 'polyfill.min.js',
            dest: 'dist/',
          },
        },

        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {
                files: {
                    'dist/index.js': 'src/index.js'
                }
            }
        },

        sass: {
            dist: {
                files: {
                    'dist/styles.css': 'scss/styles.scss'
                }
            }
        },

        uglify: {
            build: {
                src: 'src/index.js',
                dest: 'build/index.js'
            }
        },

        connect: {
            server: {
                options: {
                    port: 3000,
                    hostname: '*',
                    base: "dist",
                    keepalive: true
                }
            }
        },

        watch: {
          js: {
            files: ['src/*.js'],
            tasks: ['babel'],
            options: {
              spawn: false,
            },
          },

          scss: {
            files: ['scss/*.scss'],
            tasks: ['sass'],
            options: {
              spawn: false,
            },
          },

          html: {
            files: ['index.html'],
            tasks: ['copy'],
            options: {
              spawn: false,
            },
          },
        }


    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-babel');

    // Default task(s).
    grunt.registerTask('dev', ['copy', 'babel', 'sass', 'connect', 'watch']);

};
