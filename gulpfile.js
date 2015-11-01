var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var shell = require('gulp-shell');

gulp.task('js', function () {

  return gulp.src('source/resources/js/**/*.js', {base: 'source/resources/js'})
    .pipe(uglify())
    .pipe(gulp.dest('source/assets/js'));

});


gulp.task('css', function () {
  return gulp.src('source/resources/sass/**/*.scss', {base: 'source/resources/sass'})
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifyCSS({rebase: false}))
    .pipe(gulp.dest('source/assets/css'));
});


gulp.task('build', ['css', 'js']);

gulp.task("watch", function () {
  gulp.watch('source/resources/sass/**/*.scss', ['css']);
  gulp.watch('source/resources/js/**/*.js', ['js']);
});

gulp.task('default', ['watch', 'build']);
