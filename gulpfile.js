const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const alias = require('gulp-ts-alias');

function compile() {
  const compiled = gulp.src('./src/**/*.ts')
    .pipe(alias({ configuration: tsProject.config }))
    .pipe(sourcemaps.init())
    .pipe(tsProject());

  return compiled
  // .pipe(gulpif(isJavaScript, ugllify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
}

function watch(cb) {
  gulp.watch('src/**/*', {ignoreInitial: false}, compile);
  cb();
}

function isJavaScript(file) {
  // Check if file extension is '.js'
  return file.extname === '.js';
}

exports.compile = compile;
exports.watch = watch;
exports.default = compile;

