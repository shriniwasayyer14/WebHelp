'use strict';
var gulp = require('gulp');
var BowerWebpackPlugin = require('bower-webpack-plugin');
var footer = require('gulp-footer');
var jshint = require('gulp-jshint');
var webpack = require('webpack');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var fileToJson = require('gulp-file-contents-to-json');
var header = require('gulp-header');
var gutil = require('gulp-util');
var stylish = require('jshint-stylish');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
//var path = require('path');
var _ = require('lodash');
//var resolveBowerPath = function(componentPath){
//  return path.join(__dirname, 'bower_components', componentPath);
//};
gulp.task('html2js', function(){
    return gulp.src('templates/*.html')
        .pipe(rename(function(moduleName){
           moduleName.extname = '';
         }))
        .pipe(fileToJson('WebHelpTemplates.js'))
        .pipe(header('/*globals exports*/\n' +
            'var WebHelpTemplates ='))
        .pipe(footer(';\n' +
            'exports.WebHelpTemplates = WebHelpTemplates;'))
        .pipe(gulp.dest('js'));
});

gulp.task('stylus', function(){
    return gulp.src('css/WebHelp.styl')
        .pipe(stylus())
        .pipe(gulp.dest('css'));
});

gulp.task('webpack', ['html2js'], function(){
    var unminifiedConfig = {
        entry: './js/WebHelp.js',
        output: {
            path: __dirname + '/dist/js',
            filename: 'AladdinHelp.js',
            libraryTarget: 'var',
            library: 'WebHelp'
        }
    };

    var minifiedConfig = _.cloneDeep(unminifiedConfig);
    minifiedConfig.output.filename = 'AladdinHelp.min.js';

    //configure plugins
    unminifiedConfig.plugins = getPlugins();
    minifiedConfig.plugins = getPlugins(true);

    /*Execute webpack*/
    webpack(unminifiedConfig, function(err, stats) {
        if(err) { throw new gutil.PluginError('webpack', err);}
            gutil.log('[webpack]', stats.toString({
                // output options
            }));
    });
    webpack(minifiedConfig, function(err, stats) {
        if(err) { throw new gutil.PluginError('webpack', err);}
        gutil.log('[webpack]', stats.toString({
            // output options
        }));
    });

    function getPlugins(minify) {
        var plugins = [
            new BowerWebpackPlugin({
                modulesDirectories: ['bower_components'],
                manifestFiles: 'bower.json',
                includes: /.*/,
                excludes: [/.*\.less/, /.*\.css/],
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
});

gulp.task('jshint', function(){
    return gulp.src(['gulpfile.js',
        'js/**/*.js',
        '!js/vendor/*.js',
        'test/**/*.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('concatJS', function(){
            return gulp.src([
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
    ])
        .pipe(concat('AladdinHelp.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('concatCSS', ['stylus'], function(){
   return gulp.src([
       'bower_components/intro.js/minified/introjs.min.css',
       'css/jQueryDragSelector.css',
       'css/WebHelp.css'
   ])
       .pipe(concat('AladdinHelp.css'))
       .pipe(gulp.dest('dist/css'));
});

gulp.task('cssmin', ['concatCSS'], function(){
   return gulp.src('dist/css/AladdinHelp.css')
    .pipe(cssmin())
       .pipe(rename(function(file){
           file.extname = '.min.css';
       }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('uglify', ['webpack'], function(){
   return gulp.src('dist/js/AladdinHelp.js')
    .pipe(uglify({
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
       }))
    .pipe(rename(function(file){
           file.extname = '.min.js';
       }))
    .pipe(gulp.dest('dist/js'));
});
gulp.task('concat', ['concatJS','concatCSS']);

gulp.task('default', ['html2js','stylus','concatCSS','jshint','cssmin','webpack']);
