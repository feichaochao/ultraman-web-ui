/**
 * Created by ling on 17/1/24.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var del = require('del');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var autoPrefix = require('gulp-autoprefixer');
var less = require('gulp-less');
var runSequence = require('gulp-sequence');

var condition = true;


var debug = true;
var file = {
    "javascript":{
        "src":'./src/js/**/*.js',
        "dist":"./dist/js/"
    },
    "less":{
        "src":"./src/less/*",
        "dist":"./src/css/main"
    },
    "css":{
        "src":["./src/css/main/**/*"],
        "dist":"./dist/css"
    },
    "html":{
        "src":"./dist/*.html",
        "dist":"./dist"
    }
};


//gulp.task('copy',function(){
//    gulp.src(['./src/vendor/angular.js','./src/js/vendor/modernizr-2.8.3.min.js','./src/vendor/jquery/dist/jquery.min.js']).pipe(gulp.dest('./dist/js/vendor'));
//    gulp.src(['./src/*.*']).pipe(gulp.dest('./dist'));
//});
gulp.task('copy',function(cb){
    setTimeout(function () {
        console.log('copy');
        gulp.src(['./src/**/*','!./src/js/**/*','!./src/css/main','!./src/css/main/**','!./src/less','!./src/less/**']).pipe(gulp.dest('./dist/'));
        cb()
    }, 100)
    // 'src/**/*', '!src/less', '!src/less/**', '!src/**/less', '!src/**/less/**'
});

//合并压缩并添加版本号  .pipe(rev())添加版本号的方法
gulp.task('jsMin',function(cb){
        setTimeout(function(){
            console.log('jsMin');
            gulp.src(file.javascript.src).pipe(concat('app.min.js')).pipe(gulpif(condition,uglify())).pipe(rev()).pipe(gulp.dest(file.javascript.dist)).pipe(rev.manifest()).pipe(gulp.dest('./src/rev/js'))
            cb();
        },500)

});

//less转为css
gulp.task('less',function(cb){

    setTimeout(function(){
        console.log('less');
        gulp.src(file.less.src).pipe(less()).pipe(gulp.dest(file.less.dist))
        cb()

    },200)

});


gulp.task('cssMin',function(cb){
    setTimeout(function(){
        console.log('less');
        gulp.src(file.css.src).pipe(concat('main.min.css')).pipe(gulpif(condition,minifyCss()))
            .pipe(rev())
            .pipe(autoPrefix({
                cascade:false,
                remove:false
            }))
            .pipe(gulp.dest(file.css.dist))
            .pipe(rev.manifest())
            .pipe(gulp.dest('./src/rev/css'))
        cb()

    },300)
});

//压缩并替换html
//gulp.task('minHtml',function(){
//    gulp.src(['./src/rev/**/*.json',file.html.src])
//       .pipe(revCollector())
//       .pipe(gulpif(
//           condition,minifyHtml({
//            empty:true,
//            spare:true,
//            quotes:true
//            })
//       ))
//       .pipe(gulp.dest(file.html.dist));
//});

//删除文件
gulp.task('clean', function (cb) {
    'use strict';
    setTimeout(function(){
        del(['./dist/**/*','./src/rev','./src/css/main'])
        cb();
    },10)


});

gulp.task('minHtml',function(cb){
    setTimeout(function(){
        console.log('minHtml');
        gulp.src(['./src/rev/**/*.json',file.html.src])
            .pipe(revCollector())
            .pipe(gulpif(
                condition,minifyHtml({
                    empty:true,
                    spare:true,
                    quotes:true
                })
            ))
            .pipe(gulp.dest(file.html.dist));
        cb();
    },600)
});

gulp.task('default',runSequence('clean','copy','less','cssMin','jsMin','minHtml')
)

//gulp.task('default',['copy','jsMin','less','cssMin']);




//gulp.task('default', function(cb) {
//    runSequence('clean', 'copy', ['less', 'cssMin','jsMin'], 'minHtml')（cb）;
//});

//gulp.task('default', runSequence('clean','copy','less','cssMin'));







