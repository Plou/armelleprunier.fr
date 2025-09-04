const gulp = require('gulp')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const gutil = require('gulp-util')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const pug = require('gulp-pug')
const inlinesource = require('gulp-inline-source')
const htmlmin = require('gulp-htmlmin');
const compress = require('compression')
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const minifyCSS = require('gulp-csso')
const sourcemaps = require('gulp-sourcemaps')
const browserify = require('browserify')
const babelify = require('babelify')
const uglify = require('gulp-uglify')
const browserSync = require('browser-sync').create()



gulp.task('pug', function(){
  return gulp.src('templates/page/*.pug')
    .pipe(plumber({errorHandler: notify.onError({
      message: "<%= error.message %>",
      title: "Template compilation"
    })}))
    .pipe(pug({
      basedir: '.'
    }))
    .pipe(gulp.dest('.'))
    .pipe(browserSync.stream())
})

gulp.task('scss', function(){
  return gulp.src('css/src/**/*.scss')
    .pipe(plumber({errorHandler: notify.onError({
      message: "<%= error.message %>",
      title: "CSS preprocessing"
    })}))
    .pipe(sass())
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream({match: '**/*.css'}))
})

gulp.task('js', () => {
  return browserify('./js/src/main.js',  {debug: true})
  .transform(babelify.configure({
    presets: ["@babel/preset-env"], sourceMaps: true
  }))
  .on('error', notify.onError({
      message: "<%= error.message %>",
      title: "Babelify JS"
    }))
  .bundle()
  .on('error', notify.onError({
      message: "<%= error.message %>",
      title: "JS compilation"
    }))
  .pipe(source('main.js'))
  .pipe(buffer())
  .pipe(gulp.dest('js'))
  .pipe(browserSync.stream())
})

gulp.task('minifyCss', gulp.series('scss', function(){
  return gulp.src('css/*.css')
    .pipe(plumber({errorHandler: notify.onError({
      message: "<%= error.message %>",
      title: "CSS preprocessing"
    })}))
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer()]))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('css'))
}))

gulp.task('minifyHtml', gulp.series('minifyCss', 'pug', function(){
  return gulp.src('./*.html')
    .pipe(plumber({errorHandler: notify.onError({
      message: "<%= error.message %>",
      title: "Template compilation"
    })}))
    .pipe(inlinesource({rootpath: './'}))
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      sortAttributes: true,
      sortClassName: true
    }))
    .pipe(gulp.dest('.'))
}))

gulp.task('minifyJs', () => {
  return browserify('./js/src/main.js')
  .transform(babelify.configure({
    presets: ["@babel/preset-env"]
  }))
  .on('error', notify.onError({
      message: "<%= error.message %>",
      title: "Babelify JS"
    }))
  .bundle()
  .on('error', notify.onError({
      message: "<%= error.message %>",
      title: "JS compilation"
    }))
  .pipe(source('main.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('js'))
})

gulp.task('serve', function() {

    browserSync.init({
        server: "./",
        middleware: [compress()],
        open: false
    })

    let watcher = {
      scss : gulp.watch('css/src/**/*.scss'),
      js : gulp.watch('js/src/**/*.js'),
      pug : gulp.watch('templates/**/*.pug'),
      assets : gulp.watch('img/**/*.svg')
    }

    watcher.scss.on('all', gulp.parallel('scss'))
    watcher.js.on('all', gulp.parallel('js'))
    watcher.pug.on('all', gulp.parallel('pug'))
    watcher.assets.on('all', gulp.parallel('pug'))
})

gulp.task('build', gulp.parallel('minifyHtml', 'minifyCss', 'minifyJs'))

gulp.task('default', gulp.parallel( 'serve', 'js', 'scss', 'pug'))
