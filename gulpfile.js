const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const webpack = require('webpack-stream');
const path = require('path');
const foreach = require('gulp-foreach');
const mode = require('gulp-mode')();
const babel = require('gulp-babel');
const jsx = [
  './components/featured-products/FeaturedProducts.jsx'
];

const toUnderScore = (key) => {
  const result = key.replace( /([A-Z])/g, " $1" );
  return result.split(' ').join('_').toLowerCase().substr(1);
};

gulp.task('sass', function() {
  return gulp.src(['components/**/*.scss', 'components/mixins/*.scss'])
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(rename({ suffix: '.min', dirname: '' }))
    .pipe(gulp.dest('assets'));
});

gulp.task('js', function() {
  return gulp.src('./components/**/*.js')
    .pipe(foreach(function(stream, file){
      const filename = path.basename(file.path, '.js');
      return stream
        .pipe(
          webpack({
            mode: mode.development() ? 'development' : 'production',
            watch: mode.development(),
          })
        )
        .pipe(rename({ suffix: '.min', dirname: '', basename: filename }))
    }))
    .pipe(gulp.dest('assets'))
});

gulp.task('jsx', function() {
  return gulp.src('./components/**/*.jsx')
    .pipe(foreach(function(stream, file){
      const filename = toUnderScore(path.basename(file.path, '.jsx'));
      return stream
        .pipe(
          babel({
            presets: ['@babel/preset-env'],
            plugins: [['@babel/transform-runtime']],
          }),
        )
        .pipe(
          webpack({
            entry: jsx,
            mode: mode.development() ? 'development' : 'production',
            module: {
              rules: [
                {
                  test: /\.(jsx)$/,
                  exclude: /node_modules/,
                  use: ['babel-loader'],
                },
              ],
            },
            watch: mode.development(),
          })
        )
        .pipe(rename({ suffix: '.min', dirname: '', basename: filename }))
    }))
    .pipe(gulp.dest('assets'))
});

gulp.task('watch', function() {
  gulp.watch('./components/**/*.scss', gulp.series('sass'));
  gulp.watch('./components/**/*.js', gulp.series('js'));
  gulp.watch('./components/**/*.jsx', gulp.series('jsx'));
});

gulp.task('build', gulp.parallel('sass', 'js', 'jsx'));