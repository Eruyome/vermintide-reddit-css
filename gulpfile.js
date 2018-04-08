var gulp = require('gulp'),
	sass = require('gulp-sass'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	gitmodified = require('gulp-gitmodified'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	replace = require('gulp-replace'),
	fs = require("fs"),
	sassLint = require('gulp-sass-lint'),
	csslint = require('gulp-csslint');
	
const loadJsonFile = require('load-json-file');
	
/* Compress images (only one modified in git) */
gulp.task('images:gitmodified', function() {
	return gulp.src('./theme/img/exported/*.+(jpg|jpeg|gif|png|svg)')
		.pipe(gitmodified('modified'))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('./theme/img/exported-minified/'));
});

/* Compress images (all) */
gulp.task('images:all', function() {
	return gulp.src('./theme/img/exported/*.+(jpg|jpeg|gif|png|svg)')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('./theme/img/exported-minified/'));
});

/* linting (css) */
gulp.task('lintcss', function() {	
/*
	var linting = gulp.src('./theme/css/style.stylish.css')
		.pipe(csslint())
		.pipe(csslint.formatter()
	);
	*/
});

/* linting (scss) */
gulp.task('lint', function() {
	var linting = gulp.src('./theme/scss/*.scss')		
		.pipe(sassLint({
			configFile: 'sass-lint.yml'
		}))
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError())		
	;

	linting.on('finish', function(){
		gulp.start('replace');
	});
});

/* Compile sass and minify css (gitmodified) */
gulp.task('styles:gitmodified', function() {
	/* Compile nested (adding @charset "utf-8") */
	var compileNested = gulp.src('./theme/scss/*.scss')
		.pipe(gitmodified('modified'))
		.pipe(sass({outputStyle: 'nested'})
			.on('error', sass.logError))
		.pipe(gulp.dest('./theme/css/'))
	;
	
	/* Compile compressed (no added charset) */
	gulp.src('./theme/scss/*.scss')
		.pipe(gitmodified('modified'))
		.pipe(sass({outputStyle: 'compressed'})
			.on('error', sass.logError))
		.pipe(rename({suffix: '.min'}))
		.pipe(cssmin({showLog :true,debug:true}))
		.pipe(gulp.dest('./theme/css/'))
	;
	
	compileNested.on('end', function(){
		gulp.start('lint');
	});
});

/* replace reddit url placeholders with hardcoded full urls for use in stylish */
gulp.task('replace', function() {
	var urls = [];
	var failedReplacements = 0;
	var missingUrls = [];
	var file = './theme/css/style.css';
	
	loadJsonFile('./replacementConfig.json').then(json => {    
		urls = json.urls;

		fs.access(file, (err) => {
			if (!err) {
				replacing = gulp.src(file)
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
					.pipe(gulp.dest('./theme/css/'))
				;
				
				replacing.on('end', function(){
					gulp.start('lintcss');
					if (failedReplacements > 0) {
						console.log('           ' + failedReplacements + ' replacements failed because no matching url was found.');
						console.log('           ' + '[' + missingUrls.join(", ") + ']');
					};					
				});
			}
			else if (err) {
				// file/path is not visible to the calling process
				console.log('           ' + err.message);
				console.log('           ' + 'Replacing urls not possible!');
			}
		});
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
	var compileNested = gulp.src('./theme/scss/*.scss')
		.pipe(sass({outputStyle: 'nested'})
			.on('error', sass.logError))
		.pipe(gulp.dest('./theme/css/'))
	;
	/* Compile compressed (no added charset) */
	gulp.src('./theme/scss/*.scss')
		.pipe(sass({outputStyle: 'compressed'})
			.on('error', sass.logError))
		.pipe(rename({suffix: '.min'}))
		.pipe(cssmin({showLog :true,debug:true}))
		.pipe(gulp.dest('./theme/css/'))
	;
	
	compileNested.on('end', function(){
		gulp.start('lint');
	});
});


gulp.task('default', ['styles:all', 'images:all'], function() {
	// Watch Stylesheets
	gulp.watch('./theme/scss/*.scss', ['styles:gitmodified']);
	// Watch Images
	gulp.watch(['./theme/img/**/*.+(jpg|jpeg|gif|png|svg)'], ['images:gitmodified']);
});