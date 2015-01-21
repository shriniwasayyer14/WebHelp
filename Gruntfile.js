/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - <%= pkg.versionNumber %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;*/\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['js/vendor/*.js', 'js/*.js', '!js/vendor/jquery-*.js', '!js/jquery*.live-*.js'],
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                mangle: true
            },
            dist: {
                src: ['js/vendor/*.js', 'js/*.js', '!js/vendor/jquery-*.js', '!js/jquery*.live-*.js'],
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },
        /*watch: {
         gruntfile: {
         files: '<%= jshint.gruntfile.src %>',
         tasks: ['jshint:gruntfile']
         },
         lib_test: {
         files: '<%= jshint.lib_test.src %>',
         tasks: ['jshint:lib_test', 'qunit']
         }
         },*/
        concat_css: {
            options: {
                // Task-specific options go here.
            },
            all: {
                src: ["css/jQueryDragSelector.css", "css/WebHelp.css"],
                dest: 'dist/css/<%= pkg.name %>.css'
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    src: ["dist/css/<%= pkg.name %>.css"],
                    dest: '', //cssmin adds dist/css by itself
                    ext: '.min.css'
                }]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task.
    grunt.registerTask('default', ['concat', 'uglify', 'concat_css', 'cssmin']);

};
