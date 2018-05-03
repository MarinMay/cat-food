"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var uglify = require("gulp-uglify");
var server = require("browser-sync").create();
var run = require("run-sequence");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var del = require("del");
var ghPages = require("gulp-gh-pages");
var htmlmin = require("gulp-htmlmin");

gulp.task("style", function() {
  gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"))
    .pipe(server.stream());
});

gulp.task("copy", function() {
  return gulp.src([
    "source/fonts/**",
    "source/img/**"
  ], {
    base: "source/"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("copyJS", function() {
  return gulp.src([
    "source/js/**/*.min.js"
  ], {
    base: "source/js"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("jsmin", function() {
  return gulp.src(["source/js/**/*.js", "!source/js/**/*.min.js"])
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("build/js"));
});

// одноразовая сборка
gulp.task("build", function(done) {
  run(
    "clean",
    "copy",
    "style",
    "jsmin",
    "copyJS",
    "html",
    done
  );
});

// сборка с локальным сервером и живой перезагрузкой
gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.scss", ["style"]);
  gulp.watch("source/*.html", ["html"]);
  gulp.watch("source/js/**/*.js", ["jsmin"]);
  gulp.watch("source/js/**/*.min.js", ["copyJS"]);

  gulp.watch("build/**/*.html").on('change', server.reload);
  gulp.watch("build/css**/*.css").on('change', server.reload);
  gulp.watch("build/js/**/*.js").on('change', server.reload);
});

gulp.task("images", function() {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("source/img"));
});

gulp.task("deploy", function() {
  return gulp.src("./build/**/*")
    .pipe(ghPages());
});
