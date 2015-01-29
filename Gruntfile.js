/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        separator: ';\n',
        /*Add dummy CVS Header as banner template*/
        banner: "/*    Last edited by:  $Author: akannan $\n" +
        " *    on:  $Date: 2010-10-12 17:28:22 +0800 (Tue, 12 Oct 2010) $\n" +
        " *    Filename:  $Id: manavik.html 436280 2010-10-12 09:28:22Z manavik $\n" +
        " *    Revision:  $Revision: 436280 $\n" +
        " *    Description\n" +
        " */\n",
        // Task configuration.
        concat: {
            options: {
                stripBanners: {
                    block: true,
                    line: true
                },
                process: true,
                separator: ';\n',
                footer: ';\n'
            },
            basicJS: {
                src: ['bower_components/intro.js/intro.js',
                    'js/vendor/*.js',
                    'js/*.js',
                    '!js/vendor/jquery-*.js',
                    '!js/vendor/jquery.event.drop*.js',
                    '!js/vendor/jquery*.live-*.js',
                    '!js/vendor/jquery.jpanelmenu*.js',
                    '!js/modernizr*js'
                ],
                dest: 'dist/js/<%= pkg.name %>.js'
            },
            extrasJS: {
                src: ['bower_components/DataTables/media/js/jquery.dataTables.min.js',
                    'bower_components/intro.js/intro.js',
                    'js/vendor/*.js',
                    'js/*.js',
                    '!js/vendor/jquery.event.drop*.js',
                    '!js/vendor/jquery-*.js',
                    '!js/vendor/jquery*.live-*.js',
                    '!js/vendor/jquery.jpanelmenu*.js',
                    '!js/modernizr*js'
                ],
                dest: 'dist/js/<%= pkg.name %>WithExtras.js'
            },
            basicCSS: {
                src: ["bower_components/intro.js/minified/introjs.min.css",
                    "css/BootSideMenu.css",
                    "css/BootSideMenu.css",
                    "css/jQueryDragSelector.css",
                    "css/WebHelp.css"
                ],
                dest: 'dist/css/<%= pkg.name %>.css'
            },
            extrasCSS: {
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
        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: /\$\./g,
                            replacement: 'jQuery.'
                        },
                        {
                            match: /\$\(/g,
                            replacement: 'jQuery('
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['dist/js/<%= pkg.name %>.js'],
                        dest: 'dist/js'
                    }
                ]
            }
        },
        uglify: {
            options: {
                mangle: {
                    except: ['jQuery']
                },
                compress: {
                    sequences: true,
                    dead_code: true,
                    conditionals: true,
                    booleans: true,
                    unused: true,
                    if_return: true,
                    join_vars: true,
                    drop_console: true
                }
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
        cssmin: {
            /*This removes all banners and comments - we may not want to use this in production*/
            options: {},
            target: {
                files: [{
                    expand: true,
                    src: ["dist/css/*.css"],
                    dest: '', //cssmin adds dist/css by itself
                    ext: '.min.css'
                }]
            }
        },
        usebanner: {
            taskName: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>',
                    linebreak: true
                },
                files: {
                    src: ['dist/**/*.js', 'dist/**/*.css']
                }
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
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-replace');
    // Default task.
    grunt.registerTask('default', ['concat', 'replace', 'uglify', 'cssmin', 'usebanner', 'lineending']);

};
