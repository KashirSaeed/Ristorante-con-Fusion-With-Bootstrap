'use strict';

const { sync } = require('rimraf');

var gulp = require('gulp'),
    // sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass')(require('sass')),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');


gulp.task('sass', function () {
    return gulp.src('./css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});


gulp.task('watch:sass', function () {
    gulp.watch('./css/*.scss', gulp.series('sass'));
});

gulp.task('browser-sync', function () {
    var files = [
        './*.html',
        './css/*.css',
        './img/*.{png,jpg,gif}',
        './js/*.js'
    ];

    browserSync.init(files, {
        server: {
            baseDir: "./"
        }
    });

});

gulp.task('clean',async function() {
    return del.sync(['dist']);
});

gulp.task('copyfonts',async function() {
    return gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
 });

 // Images
gulp.task('imagemin',async function() {
    return gulp.src('img/*.{png,jpg,gif}')
      .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
      .pipe(gulp.dest('dist/img'));
  });

  gulp.task('usemin',async function() {
    return gulp.src('./*.html')
    .pipe(flatmap(function(stream, file){
        return stream
          .pipe(usemin({
              css: [ rev() ],
              html: [ function() { return htmlmin({ collapseWhitespace: true })} ],
              js: [ uglify(), rev() ],
              inlinejs: [ uglify() ],
              inlinecss: [ cleanCss(), 'concat' ]
          }))
      }))
      .pipe(gulp.dest('dist/'));
  });

//   gulp.task('built', gulp.series('clean', function() {
//       console.log("kas")
//     gulp.series('copyfonts','imagemin','usemin');
// }));


gulp.task('browserSync', gulp.series('browser-sync'));

gulp.task('watch', gulp.series('watch:sass'));

gulp.task('clean',gulp.series('clean'));

gulp.task('creatingDestinationFolder',gulp.series('copyfonts','imagemin','usemin'));

// gulp.task('built',gulp.series('clean'))

// gulp.task('built1', gulp.series('clean',async function(){
//     console.log("kas")
//     gulp.series('copyfonts','imagemin','usemin');
//     console.log("kas")
// } ));



// gulp.task('runner',function(){
//     console.log("sssssssss")
// } )


