const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
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
    .pipe(cleanCSS())
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


gulp.task('build', ['css', 'js', 'image']);

gulp.task("watch", function () {
  gulp.watch('source/resources/sass/**/*.scss', ['css']);
  gulp.watch('source/resources/js/**/*.js', ['js']);
  gulp.watch('source/resources/images/**/*', ['image']);
});

gulp.task('default', ['watch', 'build']);
