var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var autoprefixer = require("gulp-autoprefixer");
var cleanCSS = require("gulp-clean-css");
var uglify = require("gulp-uglify");
var del = require("del");
var browserSync = require("browser-sync").create();
var imagemin = require("gulp-imagemin");


/*var cssFyles = [
    "./src/css/main.css",
    "./src/css/media.css"
]*/
var jsFyles = [
    "./src/js/lib.js",
    "./src/js/main.js"
]


function styles() {
    //return gulp.src(cssFyles)
    //
    return gulp.src("src/sass/**/*.sass")
    .pipe(sass())
    //
    .pipe(concat("style.css"))
    .pipe(autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false
    }))
    .pipe(cleanCSS({
            level: 2
    }))
    .pipe(gulp.dest("./build/css"))
    .pipe(browserSync.stream())
}

function scripts() {
    return gulp.src(jsFyles)
    .pipe(concat("script.js"))
    .pipe(uglify({
        toplevel: true
    }))
    .pipe(gulp.dest("./build/js"))
    .pipe(browserSync.stream())
}
function img() {
    return gulp.src('./src/img/**')
    .pipe(imagemin())
    .pipe(gulp.dest('./build/img/'))

};

function clean() {
    return del(["build/*"])
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        notify:false
    });
    gulp.watch("./src/sass/**/*.sass", styles)
    gulp.watch("./src/js/**/*.js", scripts) 
    gulp.watch("./*.html").on('change', browserSync.reload)
    gulp.watch("./src/img/**/**", img) 
}

gulp.task("styles", styles);
gulp.task("scripts", scripts);
gulp.task("watch", watch);
gulp.task("img", img);


gulp.task("build", gulp.series(clean, img, gulp.parallel(styles, scripts)));

gulp.task("dev", gulp.series("build", "watch"));