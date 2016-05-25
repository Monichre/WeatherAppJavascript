var gulp = require('gulp');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var browserify = require('browserify');
var lib = require('bower-files')({
  "overrides":{
    "bootstrap" : {
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js"
      ]
    }
  }
});

var del = require('del');
var jshint = require('gulp-jshint');

// ENVIRONMENT VARIABLE //
var buildProduction = utilities.env.production;


gulp.task("browserify", function(){
	return browserify({entries: ["./js/weather.js"]})
		.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest('./build/js'));

});

gulp.task('minifyScripts', ['browserify'], function (){
	return gulp.src("./build/js/app.js")
		.pipe(uglify())
		.pipe(gulp.dest("./build/js"));
})

gulp.task("bowerJS", function(){
	return gulp.src(lib.ext('js').files)
		.pipe(concat('vendor.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./build/js'));
});

gulp.task("bowerCSS", function(){
	return gulp.src(lib.ext('css').files)
		.pipe(concat('vendor.css'))
		.pipe(gulp.dest('./build/css'));
});

gulp.task('bower', ['bowerJS', 'bowerCSS']);


gulp.task('clean', function(){
	return del(['build', 'tmp']);
});

gulp.task('build', ['clean'], function(){
	if(buildProduction){
		gulp.start('minifyScripts');
	} else {
		gulp.start('browserify');
	}
	  gulp.start('bower');

});

gulp.task('jshint', function(){
	return gulp.src(['js/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});
