// Define project paths.
// Note: all of these are relative to the project root.
var projectPaths = {
    sources: {
        scss: 'src/scss/**/*.scss',
        html: 'src/html/**/*.html',
        images: 'src/images/**/*',
        jade: 'src/jade/**/*.jade',
        fonts: 'src/fonts/**/*',
        scripts: 'src/js/**/*'
    },
    outputRoot: 'output'
};

// Import required dependencies.
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    browserSyncReload = browserSync.reload,
    sass = require('gulp-sass'),
    filter = require('gulp-filter'),
    concat = require('gulp-concat'),
    jade = require('gulp-jade'),
    del = require('del');

var browserSyncConfig = {
    server: {
        baseDir: './' + projectPaths.outputRoot
    },
    files: [
        projectPaths.outputRoot + '/css/*.css',
        projectPaths.outputRoot + '/*.html',
        projectPaths.outputRoot + '/js/*.js'
    ]
};

gulp.task('clean', function (cb) {
   del(['output'], cb);
});

gulp.task('sass', function() {
   return gulp.src(projectPaths.sources.scss)
        .pipe(sass())
        .pipe(gulp.dest(projectPaths.outputRoot + '/css'))
        .pipe(filter('**/*.css'))
        .pipe(browserSyncReload({stream: true}));
});

gulp.task('browser-sync', function() {
    browserSync(browserSyncConfig);
});

gulp.task('jade-compile', function () {
    gulp.src(projectPaths.sources.jade)
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest(projectPaths.outputRoot));
});

// TODO: This should probably just use a single static folder...
gulp.task('copy-static', function() {
    // Copy html
   gulp.src(projectPaths.sources.html)
        .pipe(gulp.dest(projectPaths.outputRoot));

    // Copy images
   gulp.src(projectPaths.sources.images)
        .pipe(gulp.dest(projectPaths.outputRoot + '/images'));

    // Copy fonts
   gulp.src(projectPaths.sources.fonts)
        .pipe(gulp.dest(projectPaths.outputRoot + '/fonts'));

    // Copy JS
   gulp.src(projectPaths.sources.scripts)
        .pipe(gulp.dest(projectPaths.outputRoot + '/js'));
});

gulp.task('watch', function() {
    gulp.watch(projectPaths.sources.scss, ['sass']);

    gulp.watch(projectPaths.sources.jade, ['jade-compile']);

    gulp.watch(
        [   projectPaths.sources.html,
            projectPaths.sources.images,
            projectPaths.sources.scripts,
            projectPaths.sources.fonts
        ],
        ['copy-static']);
});

gulp.task('build', ['sass', 'jade-compile', 'copy-static']);

gulp.task('clean-build', ['clean'], function () {
    // Start build after clean is complete.
    gulp.start('build');
});

gulp.task('default', ['clean-build'], function() {
    // Start browserSync, watch tasks after clean build is complete.
    gulp.start('browser-sync');
    gulp.start('watch')
});
