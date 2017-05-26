import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import del from 'del';
import stripCssComments from 'gulp-strip-css-comments';
import runSequence from 'run-sequence';
import watch from 'gulp-watch';
import glob from 'glob';
import es from 'event-stream';
import hb from 'gulp-hb';
import rename from 'gulp-rename';


////////////////
// PATHS CONFIG
////////////////

const paths = {
  'app': './app/',
  'build': './build/',
  'views': {
    'app': {
      'src': './app/views/templates/',
      'dist': './build/'
    },
    'components': {
      'src': './app/components/',
      'dist': './build/components/'
    }
  },
  'css': {
    'assets': {
      'src': './app/assets/sass/',
      'dist': './build/assets/css/'
    },
    'components': {
      'src': './app/components/',
      'dist': './build/components/'
    }
  },
  'js': {
    'assets': {
      'src': './app/assets/js/',
      'dist': './build/assets/js/'
    },
    'components': {
      'src': './app/components/',
      'dist': './build/components/'
    },
  },
  'img': {
    'assets': {
      'src': './app/assets/img/',
      'dist': './build/assets/img/'
    },
    'components': {
      'src': './app/components/',
      'dist': './build/components/'
    },
  }
};






////////////////
// CLEAN
////////////////

gulp.task('clean', (cb) => {
  del([paths.build]).then( function() {
    cb();
  });
});







////////////////
// SASS
////////////////

// ASSETS

gulp.task('sass-assets', () => {
  return gulp.src(paths.css.assets.src + '*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('maps'))
    .pipe(stripCssComments({preserve: false}))
    .pipe(gulp.dest(paths.css.assets.dist));
});

// COMPONENTS

gulp.task('sass-components', () => {
  return gulp.src(paths.css.components.src + '**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('maps'))
    .pipe(stripCssComments({preserve: false}))
    .pipe(gulp.dest(paths.css.components.dist));
});







////////////////
// JS
////////////////

// ASSETS

gulp.task('js-assets', (done) => {
  glob(paths.js.assets.src + '**/main*.js', function(err, files) {
    if(err) done(err);

    var tasks = files.map(function(file) {

      var filename = file.replace('./app/assets/js/', '');

      return browserify({ entries: [file] })
        .transform(babelify, { presets: ["es2015"] })
        .bundle()
        .pipe(source(filename))
        .pipe(gulp.dest(paths.js.assets.dist));
      });

      es.merge(tasks).on('end', done);

    })
});

// COMPONENTS

gulp.task('js-components', (done) => {
  glob(paths.js.components.src + '**/*.js', function(err, files) {
    if(err) done(err);

    var tasks = files.map(function(file) {

      var filename = file.replace('./app/components/', './');

      return browserify({ entries: [file] })
        .transform(babelify, { presets: ["es2015"] })
        .bundle()
        .pipe(source(filename))
        .pipe(gulp.dest(paths.js.components.dist));
      });

      es.merge(tasks).on('end', done);

    })
});









gulp.task('handlebars', function () {
  return gulp
    .src(paths.views.app.src + '*.{html,hbs}')
    .pipe(
      hb({
        // debug: 1
      })
      .helpers(require('handlebars-layouts'))
      .partials(paths.app + 'views/layout.hbs')
      .partials(paths.app + 'views/partials/*.hbs')
      .partials(paths.app + 'components/**/*.hbs')
    )
    .pipe(rename(function (path) {
      path.extname = ".html"
    }))
    .pipe(gulp.dest(paths.views.app.dist));
});









////////////////
// IMAGES
////////////////

// ASSETS

gulp.task('images-assets', function () {
  gulp.src(paths.img.assets.src + '**/*.{png,jpg,gif}')
  .pipe(gulp.dest(paths.img.assets.dist));
});


// COMPONENTS

gulp.task('images-components', function () {
  gulp.src(paths.img.components.src + '**/*.{png,jpg,gif}')
  .pipe(gulp.dest(paths.img.components.dist));
});










////////////////
// WATCH
////////////////

gulp.task('watch', () => {

  // SASS-ASSETS
  gulp.watch(paths.css.assets.src + '**/*.scss', function() {
    runSequence('sass-assets');
  });

  // SASS-COMPONENTS
  gulp.watch(paths.css.components.src + '**/*.scss', function() {
    runSequence('sass-components');
  });

  // JS-ASSETS
  gulp.watch(paths.js.assets.src + '**/*.js', function() {
    runSequence(['js-assets']);
  });

  // JS-COMPONENTS
  gulp.watch(paths.js.components.src + '**/*.js', function() {
    runSequence(['js-components']);
  });

  // IMG-ASSETS
  gulp.watch(paths.img.assets.src + '**/*.{png,jpg,gif}', function() {
    runSequence(['img-assets']);
  });

  // IMG-COMPONENTS
  gulp.watch(paths.img.components.src + '**/*.{png,jpg,gif}', function() {
    runSequence(['img-components']);
  });

  // HANDLEBARS
  gulp.watch(paths.app + '**/*.hbs', function() {
    runSequence(['handlebars']);
  });

});










////////////////
// GROUP TASKS
////////////////

gulp.task('sass', function(callback) {
  runSequence(['sass-assets', 'sass-components'], callback);
});

gulp.task('js', function(callback) {
  runSequence(['js-assets', 'js-components'], callback);
});

gulp.task('default', function(callback) {
  runSequence('clean', 'handlebars', ['images-assets', 'images-components'], ['js-assets', 'js-components'], ['sass-assets', 'sass-components'], callback);
});
