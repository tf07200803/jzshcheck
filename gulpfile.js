var gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify');

gulp.task('copyfile', () => {
    // 'copyFile' 是任務名稱，可自行定義
    return gulp.src('./source/jzsh.js')
        .pipe(uglify())
        //.pipe(htmlmin())//壓縮html
        .pipe(gulp.dest('./'));
});
