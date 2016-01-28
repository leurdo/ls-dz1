var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var spritesmith = require('gulp.spritesmith');
var concat = require('gulp-concat');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(sourcemaps.init())
        
        .pipe(autoprefixer({
            browsers: ['last 10 versions', 'IE 8']
        }))
        .pipe(sourcemaps.write())
        .pipe(plumber())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

gulp.task('sprite', function () {
  var spriteData = gulp.src('app/images/sprite/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css',
    imgPath: '../images/sprite.png'
    
  }));
  spriteData.img.pipe(gulp.dest('app/images/')); // путь, куда сохраняем картинку
  spriteData.css.pipe(gulp.dest('app/src/')); // путь, куда сохраняем стили
});


gulp.task('default', ['serve']);