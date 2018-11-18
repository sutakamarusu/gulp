/**
 * 目的      : gulpを使用してscssファイルのコンパイルとhtmlファイル,scssファイル、cssファイル,画像ファイルの内容の最適化を行う
 * 適用範囲   :  
 *
 * @author 
 * @version    $Id$
 */

 //----------------------------------------------
//パスの設定
//----------------------------------------------
var paths = {

    //rootディレクトリ
    root           : "public/",

    //作業用
    DevScss        : "dev/assets/scss/",    /*scss*/
    DevEjs        : "dev/ejs/",            /*ejs*/

    //出力先
    Rel            : "public/",             /*htmlとcss*/
    RelScss        : "public/scss/",        /*scss*/

};


//----------------------------------------------
//必要なプラグインの読み込み
//----------------------------------------------

var gulp = require('gulp');

//設定
var plumber = require('gulp-plumber');             /*エラーがあっても続行*/
var notify = require('gulp-notify');               /*凡庸的な通知*/
var notifier = require('node-notifier');           /*エラー通知*/
var connect = require('gulp-connect');             /*ローカルサーバーの立ち上げ*/
var rename = require('gulp-rename');               /*ファイル名を変更*/

//HTML
var htmlhint = require('gulp-htmlhint');           /*HTML構文チェック*/
var htmlbeautify = require('gulp-html-beautify');  /*HTMLの整形*/
var ejs = require("gulp-ejs");                     /*ejsテンプレートエンジン*/

//CSS,SCSS
var sass = require('gulp-sass');                   /*scssのコンパイル*/
var csslint = require('gulp-csslint');             /*csslint*/
var autoprefixer = require('gulp-autoprefixer');   /*プレフィクサーを自動で付ける*/
var csscomb = require("gulp-csscomb");             /*cssの整形*/
var cleanCSS = require('gulp-clean-css');          /*cssの圧縮*/
var sassGlob = require( 'gulp-sass-glob' );        /*importを簡略化*/


//---------------------------------------
// ejsファイルをコンパイルしhtnlファイルを生成
//---------------------------------------

gulp.task("ejs", function() {
    gulp.src(
        [paths.DevEjs + "**/*.ejs",'!' + paths.DevEjs + "/**/_*.ejs"] //注1
    )
       .pipe(ejs())
        //拡張子をhtmlに変更
       .pipe(rename({extname: '.html'}))
        //htmlファイルを整形
       .pipe(htmlbeautify(
        {
        "indent_size": 2,
        "indent_char": " ",
        }
        ))
        //出力
        .pipe(gulp.dest(paths.Rel)) 
});

//----------------------------------------------
//SCSSコンパイル
//----------------------------------------------


//コンパイル
gulp.task('scss-compile' , function(){
	//実行するファイルを指定
	gulp.src(paths.DevScss + 'style.scss')
        //エラーが起きても実行を続ける。エラー時はデスクトップに表示
        .pipe(plumber({
          errorHandler: notify.onError("コンパイル失敗")
        }))
	    //コンパイルする
        .pipe(sass())
        //コンパイルが完了したらデスクトップに表示
        .pipe(notify({
       	 title: 'scssコンパイル',
       	 message: '成功!!'
        }))
        //ベンダープレフィックスを自動付与
	    .pipe(autoprefixer({}))
	    //cssファイルを整形
	    .pipe(csscomb())
        //cssファイルを圧縮
        .pipe(cleanCSS())
        //リリース用ディレクトリへ保存
        .pipe(gulp.dest(paths.Rel))
})

//----------------------------------------
// scssファイル自体を整形
//----------------------------------------
//scssファイルを整形
gulp.task('scss-beautify', function(){
    //実行するファイルを指定
    gulp.src(paths.DevScss+'**/*.scss')
        //scssファイルを整形
        .pipe(csscomb())
        //リリース用ディレクトリに保存
        .pipe(gulp.dest(paths.RelScss));

});



//---------------------------------------
//ローカルサーバーを立ち上げる
//---------------------------------------
gulp.task('serve', function(){
  connect.server({
  	root: paths.root
  });
});


//----------------------------------------
// 監視しタスクを実行する
//----------------------------------------

gulp.task('watch-html' , function(){
    gulp.watch([paths.DevEjs + "**/*.ejs",'!' + paths.DevEjs + "/**/_*.ejs"] , ['ejs'])
});

gulp.task( 'watch-scss' , function(){
	//作業用scssファイルの監視
	gulp.watch(paths.DevScss+ '*.scss' , ['scss-compile'])
});

//----------------------------------------
// 実行
//----------------------------------------
gulp.task( 'default', ['watch-html' , 'watch-scss' , 'serve']);

