module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'js/bootstrap.js',
                    'js/checkout.js'
                ],
                dest: 'production/build.js',
            }
        },
        uglify: {
            build: {
                src: 'production/build.js',
                dest: 'production/build.min.js'
            }
        },
        cssmin: {
            combine: {
                files: {
                    'production/build.css': ['css/bootstrap.css', 'css/addon.css']
                }
            },
            minify: {
                expand: true,
                cwd: 'css/',
                src: ['build.css'],
                dest: 'production/',
                ext: '.min.css'
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001
                }
            }
        },
        watch: {
            scripts: {
                files: ['js/*.js', 'css/*.css'],
                tasks: ['concat', 'uglify', 'cssmin'],
                options: {
                    spawn: false,
                },
            }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'connect', 'watch']);

};