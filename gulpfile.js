'use strict';
var gulp = require('gulp');
var BowerWebpackPlugin = require('bower-webpack-plugin');
var footer = require('gulp-footer');
var jshint = require('gulp-jshint');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var stylus = require('gulp-stylus');
var rename = require('gulp-rename');
var fileToJson = require('gulp-file-contents-to-json');
var header = require('gulp-header');
var stylish = require('jshint-stylish');
var cssmin = require('gulp-cssmin');
var replace = require('gulp-replace');
var mergeStream = require('merge-stream');
//var debug = require('gulp-debug');
var _ = require('lodash');

/*HTML Templates in ./templates are converted to an HTML object*/
gulp.task('html2js', function () {
	return gulp.src('templates/*.html')
		.pipe(rename(function (moduleName) {
			moduleName.extname = '';
		}))
		.pipe(fileToJson('WebHelpTemplates.js'))
		.pipe(header('/*globals exports*/\n' +
			'var WebHelpTemplates ='))
		.pipe(footer(';\n' +
			'exports.WebHelpTemplates = WebHelpTemplates;')) //add footer so we can require it correctly
		.pipe(gulp.dest('js'));
});

/*Compile stylus files into CSS*/
gulp.task('stylus', function () {
	gulp.src('css/WebHelp.styl')
		.pipe(stylus({
			'include css': true
		}))
		.pipe(rename('AladdinHelp.css'))
		.pipe(gulp.dest('dist/css'))
		.pipe(cssmin())
		.pipe(rename('AladdinHelp.min.css'))
		.pipe(gulp.dest('dist/css'));
});

/*Webpack build*/
gulp.task('webpack', ['html2js'], function () {
	//internal function to get the right configs for webpack
	function getConfigs() {
		var unminifiedConfig = {
			entry: './js/WebHelp.js',
			output: {
				path: __dirname + '/dist/js',
				filename: 'AladdinHelp.js',
				libraryTarget: 'var',
				library: 'WebHelp'
			},
			module:{
				loaders:[
					{test: /\.json$/,loader:"json-loader"}
				]
			}
		};
		var minifiedConfig = _.cloneDeep(unminifiedConfig);
		minifiedConfig.output.filename = 'AladdinHelp.min.js';
		function getPlugins(minify) {
			var plugins = [
				new BowerWebpackPlugin({
					modulesDirectories: ['bower_components'],
					manifestFiles: 'bower.json',
					includes: /.*/,
					excludes: [/.*\.less/, /.*\.css/, /.*\.ttf/, /.*\.woff*/],
					searchResolveModulesDirectories: true
					//excludes: /.*\.less/
				}),
				new webpack.ProvidePlugin({ //this creates globals inside the closure - only for requirements that return functions
					$: 'jquery',
					jQuery: 'jquery'
				})
			];
			if (minify) {
				plugins.push(new webpack.optimize.UglifyJsPlugin({
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
				}));
			}
			return plugins;
		}
		//configure plugins
		unminifiedConfig.plugins = getPlugins();
		minifiedConfig.plugins = getPlugins(true);

		return {
			minifiedConfig: minifiedConfig,
			unminifiedConfig: unminifiedConfig
		};
	}

	var configs = getConfigs();

	/*Execute webpack tasks*/
	var unminifiedBuild = gulp
												.src(configs.unminifiedConfig.entry)
												.pipe(webpackStream(configs.unminifiedConfig))
												.pipe(gulp.dest('dist/js/'));

	var minifiedBuild = gulp
											.src(configs.minifiedConfig.entry)
											.pipe(webpackStream(configs.minifiedConfig))
											.pipe(gulp.dest('dist/js/'));

	/*Merge both webpack task streams so that we only return from this function when they're complete*/
	return mergeStream(unminifiedBuild, minifiedBuild);
});

/*Code style checking*/
gulp.task('jshint', function () {
	return gulp.src(['gulpfile.js',
			'js/**/*.js',
			'!js/vendor/*.js',
			'test/**/*.js'
		])
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

/*Replace custom class*/
gulp.task('replace', ['webpack'], function () {
	return gulp.src(['./dist/js/*.js'])
		.pipe(replace(/introjs-fixParent/g, 'introjs-customFixParent'))
		.pipe(gulp.dest('./dist/js'));
});

/*Default build task*/
gulp.task('default', ['html2js', 'stylus', 'jshint', 'webpack', 'replace']);




