var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var sequence = require('run-sequence');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var ngmin = require('gulp-ngmin');
var stripDebug = require('gulp-strip-debug');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var ngTemplate = require('gulp-ng-template');
var replace = require('gulp-replace');
var md5 = require("gulp-md5-plus");
var pkg = require('./package.json');
var argv = process.argv;

var banner = [
  '/**',
  ' ** <%= pkg.name %> - <%= pkg.description %>',
  ' ** @author <%= pkg.author %>',
  ' ** @version v<%= pkg.version %>',
  ' **/',
  ''
].join('\n');

var paths = {
  sass: ['./source/scss/**/*.scss'],
  js: ['./source/js/**/*.js'],

  normaljs: [
    './source/js/zepto.min.js',
    './source/lib/iosSelect/iosSelect.js'
  ],
  ngjs: [
    './source/lib/angular-notify/dist/angular-notify.min.js',

    './source/js/services/util.js',
    './source/js/services/component.js',
    './source/js/services/service.js',

    './source/js/filters/filter.js',
    './source/js/directives/directive.js',
    './source/js/app.js',

    // config files
    './source/js/config.js',
    './source/js/config.api.js',
    './source/js/config.permission.js',

    // routers
    './source/js/routers/router.js',
    './source/js/routers/account.js',
    './source/js/routers/stock.js',
    './source/js/routers/trade.js',

    // controllers
    './source/js/controllers/app.js',
    './source/js/controllers/account.js',
    './source/js/controllers/stock.js',
    './source/js/controllers/trade.js',
  ],
  libcss: [
    './source/lib/iosSelect/iosSelect.css',
    './source/lib/ionic/css/ionic.min.css',
    './source/lib/angular-notify/dist/angular-notify.min.css',
  ]
};

// 将代码发布到site目录
gulp.task('release', function(done){
  sh.exec('gulp uglify'); // 压缩常规js
  sh.exec('gulp ngmin'); // 压缩angular的js
  sh.exec('gulp htmlmin'); // 压缩html文件到dist目录

  sh.exec('gulp compass'); // 编译scss文件
  sh.exec('gulp copy2site'); // 拷贝任务
  sh.exec('gulp cssmin'); // 压缩dist里面的css文件并生成sourcemap 这样可以不管compass用什么模式 确保dist中的css是最小的

  sh.exec('gulp md5'); // 增量发布

  sh.exec('gulp cleantemp'); // 清理构建过程中产生的临时目录
});

// 压缩普通js代码
gulp.task('uglify', function(){
  return gulp.src(paths['normaljs'])
      .pipe(uglify({ outSourceMap: false}))
      .pipe(concat('normaljs.min.js'))
      .pipe(header(banner, {pkg: pkg}))
      .pipe(gulp.dest('./site/js/'))
});

// 压缩angular代码
gulp.task('ngmin', function() {
  return gulp.src(paths['ngjs'])
      .pipe(ngmin({ dynamic: false}))
      //.pipe(stripDebug())
      .pipe(uglify({ outSourceMap: false, mangle: false}))
      .pipe(concat('ng.min.js'))
      .pipe(header(banner, {pkg: pkg}))
      .pipe(gulp.dest('./site/js/'))
});

// 压缩合并html模板
gulp.task('htmlmin', function(){
  gulp.src(['./source/templates/**/*.html'])
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('./source/.build/templates/'))
      .pipe(ngTemplate({
        filePath: 'templates.min.js',
        moduleName: 'cfywap'
      }))
      .pipe(gulp.dest('./site/js/'));
});

// 编译scss文件，依赖ruby及compass环境
gulp.task('compass', function() {
  sh.cd('source');
  sh.exec('compass compile --force');
});

//拷贝src
gulp.task('copy2site', function() {
  // copy css
  gulp.src(['./source/css/**/*.css', './source/lib/angular-notify/dist/angular-notify.min.css'])
      .pipe(gulp.dest('./site/css/'));

  // copy images
  gulp.src(['./source/images/**/*'])
      .pipe(gulp.dest('./site/images/'));

  // copy fonts of ionic
  gulp.src(['./source/lib/ionic/fonts/**/*', './source/font/**/*'])
      .pipe(gulp.dest('./site/fonts/'));

  // 将index.min.html拷贝到dist目录
  gulp.src(['./source/index.min.html', './source/index.test.html'])
      .pipe(gulp.dest('./site/'));

  // 将ionic的js库copy到dist目录
  gulp.src(['./source/lib/ionic/js/ionic.bundle.min.js'])
      .pipe(gulp.dest('./site/js'));

  //将city.min.js库copy到dist目录
  gulp.src(['./source/js/city.min.js'])
      .pipe(gulp.dest('./site/js'));

  // 将.build临时文件夹中的templates/common文件夹copy到dist目录
  gulp.src('./source/.build/templates/common/**/*')
      .pipe(gulp.dest('./site/templates/common/'));
});

// 压缩css
gulp.task('cssmin', function() {
  // 自己的css文件
  gulp.src(['./site/fonts/*.css', './site/css/*.css'])
      .pipe(minifyCss())
      .pipe(header(banner, {pkg: pkg}))
      .pipe(gulp.dest('./site/css/'));

  // 第三方库的css文件
  gulp.src(paths['libcss'])
      .pipe(minifyCss())
      .pipe(concat('libcss.min.css'))
      .pipe(header(banner, {pkg: pkg}))
      .pipe(gulp.dest('./site/css/'));
});

// js css images增亮发布
gulp.task('md5', function(){
  gulp.src('./site/js/*.min.js')
      .pipe(md5(10,'./site/index.min.html'))
      .pipe(gulp.dest('./site/js/'));

  gulp.src('./site/fonts/iconfont.css')
      .pipe(md5(10,'./site/index.min.html'))
      .pipe(gulp.dest('./site/fonts/'));

  gulp.src([
        './site/css/angular-notify.min.css'
        ,'./site/css/common.css'
        ,'./site/css/demo.css'
        ,'./site/css/iconfont.css'
        ,'./site/css/libcss.min.css'
      ])
      .pipe(md5(10,'./site/index.min.html'))
      .pipe(gulp.dest('./site/css/'));
});

// 清理构建过程中生成的临时文件
gulp.task('cleantemp', function(){
  // read false 不读取文件 加快速度
  return gulp.src('./source/.build/', {read: false})
      .pipe(clean())
});
