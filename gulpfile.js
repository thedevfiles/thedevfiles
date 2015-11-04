var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

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

gulp.task('image', function () {
  return gulp.src('source/resources/images/**/*')
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
      }))
      .pipe(gulp.dest('source/assets/images'));
});


gulp.task('build', ['css', 'js']);

gulp.task("watch", function () {
  gulp.watch('source/resources/sass/**/*.scss', ['css']);
  gulp.watch('source/resources/js/**/*.js', ['js']);
  gulp.watch('source/resources/images/**/*', ['image']);
});

gulp.task('default', ['watch', 'build']);
