var gulp = require('gulp'),
	sass = require('gulp-sass'),
	//nano = require('gulp-cssnano'),
	//minifyCss = require('gulp-minify-css'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	gitmodified = require('gulp-gitmodified'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	replace = require('gulp-replace'),
	replacementConfig = require('./replacementConfig.json');
	
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
gulp.task('styles:gitmodified', function() {
	/* Compile nested (adding @charset "utf-8") */
	var compileNested = gulp.src('./scss/*.scss')
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
	
	compileNested.on('end', function(){
		gulp.start('replace');
	});
});

/* replace reddit url placeholders with hardcoded full urls for use in stylish */
gulp.task('replace', function() {
	var urls = replacementConfig.urls;
	var failedReplacements = 0;
	var missingUrls = [];
	
	var replacing = gulp.src(["./css/new.css"])
		.pipe(replace(/(%%(.*?)%%)/g, function(match, p1, p2, offset, string) {
			var url = searchUrl(p2, urls);
			//console.log('Found "' + match + '" and replaced with "' + url + '" at ' + offset);			
			if (typeof url === "undefined") {
				failedReplacements++;
				if (missingUrls.indexOf(p2) < 0) {
					missingUrls.push(p2);
				}
				return match;
			} else {
				return '"' + url + '"';
			}
		}))
		.pipe(rename({suffix: '.stylish'}))
		.pipe(gulp.dest('./css/'))		
	;
	
	replacing.on('end', function(){
		if (failedReplacements > 0) {
				console.log('           ' + failedReplacements + ' replacements failed because no matching url was found.');
				console.log('           ' + '[' + missingUrls.join(", ") + ']');
			};
		
	});
});

function searchUrl(placeholderKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].placeholder === placeholderKey) {
            return myArray[i].url;
        }
    }
}

/* Compile sass and minify css (all) */
gulp.task('styles:all', function() {
	/* Compile nested (adding @charset "utf-8") */
	var compileNested = gulp.src('./scss/*.scss')
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
	
	compileNested.on('end', function(){
		gulp.start('replace');
	});
});


gulp.task('default', ['styles:all', 'images:all'], function() {
	// Watch Stylesheets
	gulp.watch('./scss/*.scss', ['styles:gitmodified']);
	// Watch Images
	gulp.watch(['./img/**/*.+(jpg|jpeg|gif|png|svg)'], ['images:gitmodified']);
});