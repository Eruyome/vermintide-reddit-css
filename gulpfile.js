var gulp = require('gulp'),
	sass = require('gulp-sass'),
	//nano = require('gulp-cssnano'),
	//minifyCss = require('gulp-minify-css'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	gitmodified = require('gulp-gitmodified'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant');

/* Compress images (only one modified in git) */
gulp.task('images:gitmodified', function() {
	return gulp.src('./img/exported/*.+(jpg|jpeg|gif|png|svg)')
		.pipe(gitmodified('modified'))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('./img/exported-minified/'));
});

/* Compress images (all) */
gulp.task('images:all', function() {
	return gulp.src('./img/exported/*.+(jpg|jpeg|gif|png|svg)')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('./img/exported-minified/'));
});

/* Compile sass and minify css (gitmodified) */
gulp.task('styles:gitmodified', function(done) {
	/* Compile nested (adding @charset "utf-8") */
	gulp.src('./scss/*.scss')
		.pipe(gitmodified('modified'))
		.pipe(sass({outputStyle: 'nested'})
			.on('error', sass.logError))
		.pipe(gulp.dest('./css/'))
	;
	/* Compile compressed (no added charset) */
	gulp.src('./scss/*.scss')
		.pipe(gitmodified('modified'))
		.pipe(sass({outputStyle: 'compressed'})
			.on('error', sass.logError))
		.pipe(rename({suffix: '.min'}))
		//.pipe(nano({zindex:false}))
		//.pipe(minifyCss())
		.pipe(cssmin({showLog :true,debug:true}))
		.pipe(gulp.dest('./css/'))
	;

	done();
});

/* Compile sass and minify css (all) */
gulp.task('styles:all', function(done) {
	/* Compile nested (adding @charset "utf-8") */
	gulp.src('./scss/*.scss')
		.pipe(sass({outputStyle: 'nested'})
			.on('error', sass.logError))
		.pipe(gulp.dest('./css/'))
	;
	/* Compile compressed (no added charset) */
	gulp.src('./scss/*.scss')
		.pipe(sass({outputStyle: 'compressed'})
			.on('error', sass.logError))
		.pipe(rename({suffix: '.min'}))
		//.pipe(nano({zindex:false}))
		//.pipe(minifyCss())
		.pipe(cssmin({showLog :true,debug:true}))
		.pipe(gulp.dest('./css/'))
	;

	done();
});

gulp.task('default', gulp.series('styles:all', 'images:all', function(done) {
	// Watch Stylesheets
	//gulp.watch('./scss/*.scss', ['styles:gitmodified']);
	gulp.watch('./scss/*.scss', gulp.series('styles:gitmodified'));
	// Watch Images
	//gulp.watch(['./img/**/*.+(jpg|jpeg|gif|png|svg)'], ['images:gitmodified']);
	gulp.watch(['./img/**/*.+(jpg|jpeg|gif|png|svg)'], gulp.series('images:gitmodified'));

	done();
}));