

const gulp = require('gulp')
const clean = require('gulp-clean');
const ts = require('gulp-typescript')
const tsProject = ts.createProject("tsconfig.json");
const uglify = require('gulp-uglify')

const browserify = require('browserify')
const tsify = require('tsify')

const buffer = require('vinyl-buffer')
const source = require('vinyl-source-stream')

//
// gulp.task('clean', function () {
//   return gulp
//       .src('dist', { read: false, allowEmpty: true })
//       .pipe(clean('dist'));
// });
//
//
// gulp.task('tsc', () => {
//   return gulp
//       .src(['./src/**/*.ts', './!(node_modules)/*.ts'])
//       .pipe(ts({
//         // { "declaration": true }
//         // /* Generates corresponding '.d.ts' file. */
//         declaration: true
//       }))
//       .pipe(gulp.dest('dist'))
// })
//
//
// gulp.task('clean-js', function () {
//   return gulp
//       .src('dist/**/*.js', { read: false })
//       .pipe(clean('*.js'));
// });
//
//
// gulp.task('build', () => {
//   return browserify({
//     basedir: './src',
//     debug: true,
//     entries: ['walletWorker.ts'],
//     cache: {},
//     packageCache: {}
//   }).plugin(tsify).bundle()
//       .pipe(source('serviceWorker.js'))
//       .pipe(buffer())
//       .pipe(uglify())
//       .pipe(gulp.dest('dist'))
// })
//
// gulp.task('default'
//     , gulp.series(
//         gulp.parallel('clean'),
//         gulp.parallel('tsc'),
//         gulp.parallel('clean-js'),
//         gulp.parallel('build')
//     )
// )

//
gulp.task("default", function () {
  return tsProject.src()
      .pipe(tsProject())
      .pipe(uglify())
      .pipe(gulp.dest("lib"));
});
