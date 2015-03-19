/*global module:false*/
'use strict';
module.exports = function (grunt) {
	// Load all grunt tasks
	require('load-grunt-tasks')(grunt);
	// Show elapsed time at the end
	require('time-grunt')(grunt);
  
	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		separator: ';\n',
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
                    'js/*.js'
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
				src: ['bower_components/intro.js/minified/introjs.min.css',
                    'css/BootSideMenu.css',
                    'css/BootSideMenu.css',
                    'css/jQueryDragSelector.css',
                    'css/WebHelp.css'
                ],
				dest: 'dist/css/<%= pkg.name %>.css',
				options: {
					separator: '',
					footer: ''
				}
			},
			extrasCSS: {
				src: ['bower_components/DataTables/media/css/jquery.dataTables.min.css',
                    'bower_components/DataTables/media/css/jquery.dataTables_themeroller.css',
                    'bower_components/intro.js/minified/introjs.min.css',
                    'css/BootSideMenu.css',
                    'css/BootSideMenu.css',
                    'css/jQueryDragSelector.css',
                    'css/WebHelp.css'
                ],
				dest: 'dist/css/<%= pkg.name %>WithExtras.css',
				options: {
					separator: '',
					footer: ''
				}
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
		stylus: {
			compile: {
				options: {
					paths: ['css/stylusImports'],
					compress: false,
					urlfunc: 'embedurl' // use embedurl('test.png') in our code to trigger Data URI embedding
				},
				files: {
					'css/WebHelp.css': 'css/WebHelp.styl' // 1:1 compile
					//'path/to/another.css': ['path/to/sources/*.styl', 'path/to/more/*.styl'] // compile and concat into single file
				}
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
		watch: {
			WebHelpTemplates: {
				files: 'templates/*',
				tasks: ['htmlConvert:WebHelpTemplates']
			},
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			src: {
				files: '<%= jshint.src.src %>',
				tasks: ['jshint:src', 'qunit']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'qunit']
			}
    
		},
		cssmin: {
			/*This removes all banners and comments - we may not want to use this in production*/
			options: {},
			target: {
				files: [{
					expand: true,
					src: ['dist/css/*.css'],
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
		},
		jshint: {
		  options: {
			reporter: require('jshint-stylish')
		  },
		  gruntfile: {
			options: {
			  jshintrc: '.jshintrc'
			},
			src: 'Gruntfile.js'
		  },
		  src: {
			options: {
			  jshintrc: 'js/.jshintrc'
			},
			src: ['js/**/*.js']
		  },
		  test: {
			options: {
			  jshintrc: 'test/.jshintrc'
			},
			src: ['test/**/*.js']
		  }
		},
		htmlConvert: {
			WebHelpTemplates: {
                options: {
                  rename: function(moduleName) {
                      var newName = moduleName.replace('.html', '').split('/');
                      return newName[newName.length - 1];
                  }
                },
				src: ['templates/*.html'],
				dest: 'js/WebHelpTemplates.js'
			}
		},
		connect: {
		  server: {
			options: {
			  hostname: '*',
			  port: 9000
			}
		  }
		},
		qunit: {
		  all: {
			options: {
			  urls: ['http://localhost:9000/index.html']
			}
		  }
		},
        browserSync: {
            dev: {
                bsFiles: {
                    src : '*'
                },
                options: {
                    proxy: 'localhost:9000'
                }
            }
        }
	});

	// Default task.
	grunt.registerTask('default', ['htmlConvert', 'stylus:compile', 'concat', 'replace', 'jshint', 'uglify', 'cssmin', 'lineending']);
	grunt.registerTask('serve', ['connect', 'browserSync', 'watch']);

};