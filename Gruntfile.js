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
            basic: {
                src: ['bower_components/intro.js/intro.js',
                    'js/vendor/*.js',
                    'js/*.js',
                    '!js/vendor/jquery-*.js',
                    '!js/jquery*.live-*.js'
                ],
                dest: 'dist/js/<%= pkg.name %>.js'
            },
            extras: {
                src: ['bower_components/DataTables/media/js/jquery.dataTables.min.js',
                    'bower_components/intro.js/intro.js',
                    'js/vendor/*.js', 'js/*.js',
                    '!js/vendor/jquery-*.js',
                    '!js/jquery*.live-*.js'
                ],
                dest: 'dist/js/<%= pkg.name %>WithExtras.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                mangle: true
            },
            basic: {
                src: ['dist/js/<%= pkg.name %>.js'],
                dest: 'dist/js/<%= pkg.name %>.min.js'
            },
            extras: {
                src: ['dist/js/<%= pkg.name %>WithExtras.js'],
                dest: 'dist/js/<%= pkg.name %>WithExtras.min.js'
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
            basic: {
                src: ["bower_components/intro.js/minified/introjs.min.css",
                    "css/BootSideMenu.css",
                    "css/BootSideMenu.css",
                    "css/jQueryDragSelector.css",
                    "css/WebHelp.css"
                ],
                dest: 'dist/css/<%= pkg.name %>.css'
            },
            extras: {
                src: ["bower_components/DataTables/media/css/jquery.dataTables.min.css",
                    "bower_components/DataTables/media/css/jquery.dataTables_themeroller.css",
                    "bower_components/intro.js/minified/introjs.min.css",
                    "css/BootSideMenu.css",
                    "css/BootSideMenu.css",
                    "css/jQueryDragSelector.css",
                    "css/WebHelp.css"
                ],
                dest: 'dist/css/<%= pkg.name %>WithExtras.css'
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    src: ["dist/css/*.css"],
                    dest: '', //cssmin adds dist/css by itself
                    ext: '.min.css'
                }]
            }
        },
        lineending: {
            /*Ensure we have UTF-8 Unix line endings*/
            dist: {
                options: {
                    overwrite: true
                },
                files: {
                    '': ['dist/**/*.js', 'dist/**/*.css']
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-lineending');

    // Default task.
    grunt.registerTask('default', ['concat', 'uglify', 'concat_css', 'cssmin', 'lineending']);

};
