/*global module:false*/
'use strict';
var webpack = require('webpack');
var BowerWebpackPlugin = require('bower-webpack-plugin');
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
		webpack: {
			WebHelp: {
				entry:   './js/WebHelp.js',
				output:  {
					path:     __dirname + '/dist/js',
					filename: 'AladdinHelp.js',
					libraryTarget: 'var',
					library: 'WebHelp'
				},
				module:  {
					loaders: [
						{test: /\.css$/, loader: 'style!css'},
						{test: /\.styl$/, loader: 'style!css!stylus-loader'},
						{test: /\.less$/, loader: 'style!css!less'},
						{test: /\.(woff|svg|ttf|eot)([\?]?.*)$/, loader: 'file-loader?name=[name].[ext]'}
					]
				},
				plugins: [
					new BowerWebpackPlugin({
						//excludes: /.*\.less/
					}),
					new webpack.ProvidePlugin({ //this creates globals inside the closure - only for requirements that return functions
						$:      'jquery',
						jQuery: 'jquery',
						introJsParent: 'intro.js'
					})
				]
			}
		},
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
				src: [
					'bower_components/intro.js/intro.js',
					/*'bower_components/jquery-ui/ui/core.js',
					'bower_components/jquery-ui/ui/widget.js',
					'bower_components/jquery-ui/ui/mouse.js',
					'bower_components/jquery-ui/ui/position.js',
					'bower_components/jquery-ui/ui/sortable.js',*/
					'bower_components/jquery-get-path/dist/js/jQueryGetPath.js',
					'js/vendor/*.js',
					//'dist/bundle.js'
					'js/*.js'
				],
				dest: 'dist/js/<%= pkg.name %>.js'
			},
			extrasJS: {
				src: [
					'bower_components/intro.js/intro.js',
					'bower_components/jquery-ui/ui/core.js',
					'bower_components/jquery-ui/ui/widget.js',
					'bower_components/jquery-ui/ui/mouse.js',
					'bower_components/jquery-ui/ui/position.js',
					'bower_components/jquery-ui/ui/sortable.js',
					'bower_components/jquery-get-path/dist/js/jQueryGetPath.js',
					'js/vendor/*.js',
					//'dist/bundle.js'
					'js/*.js'
				],
				dest: 'dist/js/<%= pkg.name %>WithExtras.js'
			},
			basicCSS: {
				src: ['bower_components/intro.js/minified/introjs.min.css',
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
				src: [
					'bower_components/intro.js/minified/introjs.min.css',
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
				src: ['dist/js/*.js'],             // source files array (supports minimatch)
				overwrite: true,
				replacements: [{
					from: 'introjs-fixParent',                   // string replacement
					to: 'introjs-customFixParent'
				}]
				/*Also add later*/
				/*{
					match: /\$\./g,
					replacement: 'jQuery.'
				},
				{
					match: /\$\(/g,
					replacement: 'jQuery('
				},*/
			}
		},
		/*replace: {
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
						},
						{
							match: '/introjs-fixParent/g',
							replacement: '/introjs-customFixParent/'
						}
					]
				},
				files: [
					{
						expand: true,
						flatten: true,
						src: ['dist/js/*.js'],
						dest: 'dist/js'
					}
				]
			}
		},*/
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
				tasks: ['htmlConvert:WebHelpTemplates', 'footer:WebHelpTemplates']
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
				src: ['js/**/*.js', '!js/vendor/*.js']
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
					rename: function (moduleName) {
						var newName = moduleName.replace('.html', '').split('/');
						return newName[newName.length - 1];
					}
				},
				src: ['templates/*.html'],
				dest: 'js/WebHelpTemplates.js'
			}
		},
		footer: {
			WebHelpTemplates: {
				options: {
					text: 'exports.WebHelpTemplates = WebHelpTemplates;'
				},
				files: {
					'js/WebHelpTemplates.js': 'js/WebHelpTemplates.js'
				}
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
					src: '*'
				},
				options: {
					proxy: 'localhost:9000'
				}
			}
		}
	});

	// Default task.
	grunt.loadNpmTasks('grunt-webpack');
	grunt.registerTask('default', ['htmlConvert', 'stylus:compile', 'concat', 'replace', 'jshint', 'uglify', 'cssmin', 'lineending','footer', 'webpack']);
	grunt.registerTask('serve', ['connect', 'browserSync', 'watch']);

};
