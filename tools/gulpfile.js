var gulp = require('gulp');
var fs = require('fs');
var concat = require('gulp-concat');
var gzip = require('gulp-gzip');
var flatmap = require('gulp-flatmap');
var path = require('path');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var pump = require('pump');

function createFolders(cb){
	const webh = "../../src/webh";
	const js = "../../src/websrc/gzipped/js";
	const fonts = "../../src/websrc/gzipped/fonts";
	const img = "../../src/websrc/gzipped/img";
	const html = "../../src/websrc/gzipped/html";
	
	const dirs = [webh, js, fonts, img, html];
	
	for(let index in dirs){
		const dir = dirs[index];
		if(!fs.existsSync(dir)){
			fs.mkdirSync(dir, { recursive: true });
			console.log(`mk dir: ${dir}`);
		}else{
			console.log(`dir already exists: ${dir}`);
		}
	}
	
	cb();
}

function stylesConcat() {
    return gulp.src(['../../src/websrc/css/style.css', '../../src/websrc/css/bootstrap.min.css'])
        .pipe(concat({
            path: 'required.css',
            stat: {
                mode: 0666
            }
        }))
        .pipe(gulp.dest('../../src/websrc/css/'))
        .pipe(gzip({
            append: true
        }))
        .pipe(gulp.dest('../../src/websrc/gzipped/css/'));
}

function styles(cb) {
    var source = "../../src/websrc/gzipped/css/";
    var destination = "../../src/webh/" + "required.css.gz.h";
    var wstream = fs.createWriteStream(destination);
    wstream.on('error', function (err) {
        console.error(err);
    });
 
    var data = fs.readFileSync(source + "required.css.gz");
 
    wstream.write('#define required_css_gz_len ' + data.length + '\n');
    wstream.write('const uint8_t required_css_gz[] PROGMEM = {')
 
    for (i=0; i<data.length; i++) {
        if (i % 1000 == 0) wstream.write("\n");
        wstream.write('0x' + ('00' + data[i].toString(16)).slice(-2));
        if (i<data.length-1) wstream.write(',');
    }
 
    wstream.write('\n};')
    wstream.end();
    cb();	
}


function scriptsgz() {
	return gulp.src("../../src/websrc/js/*.*")
        .pipe(gulp.dest("../../src/websrc/js/"))
            .pipe(gzip({
                append: true
            }))
        .pipe(gulp.dest('../../src/websrc/gzipped/js/'));
}

function scripts() {
    return gulp.src("../../src/websrc/gzipped/js/*.*")
        .pipe(flatmap(function(stream, file) {
			var filename = path.basename(file.path);
            var wstream = fs.createWriteStream("../../src/webh/" + filename + ".h");
            wstream.on("error", function(err) {
                console.error(err);
            });
			var data = file.contents;
            wstream.write("#define " + filename.replace(/\.|-/g, "_") + "_len " + data.length + "\n");
            wstream.write("const uint8_t " + filename.replace(/\.|-/g, "_") + "[] PROGMEM = {")
            
            for (i = 0; i < data.length; i++) {
                if (i % 1000 == 0) wstream.write("\n");
                wstream.write('0x' + ('00' + data[i].toString(16)).slice(-2));
                if (i < data.length - 1) wstream.write(',');
            }

            wstream.write("\n};")
            wstream.end();

            return stream;
        }));
}

function fontgz() {
	return gulp.src("../../src/websrc/fonts/*.*")
        .pipe(gulp.dest("../../src/websrc/fonts/"))
            .pipe(gzip({
                append: true
            }))
        .pipe(gulp.dest('../../src/websrc/gzipped/fonts/'));
}

function fonts() {
    return gulp.src("../../src/websrc/gzipped/fonts/*.*")
        .pipe(flatmap(function(stream, file) {
			var filename = path.basename(file.path);
            var wstream = fs.createWriteStream("../../src/webh/" + filename + ".h");
            wstream.on("error", function(err) {
                console.error(err);
            });
			var data = file.contents;
            wstream.write("#define " + filename.replace(/\.|-/g, "_") + "_len " + data.length + "\n");
            wstream.write("const uint8_t " + filename.replace(/\.|-/g, "_") + "[] PROGMEM = {")
            
            for (i = 0; i < data.length; i++) {
                if (i % 1000 == 0) wstream.write("\n");
                wstream.write('0x' + ('00' + data[i].toString(16)).slice(-2));
                if (i < data.length - 1) wstream.write(',');
            }

            wstream.write("\n};")
            wstream.end();

            return stream;
        }));
}

function imggz() {
	return gulp.src("../../src/websrc/img/*.*")
        .pipe(gulp.dest("../../src/websrc/img/"))
            .pipe(gzip({
                append: true
            }))
        .pipe(gulp.dest('../../src/websrc/gzipped/img/'));
}

function imgs() {
    return gulp.src("../../src/websrc/gzipped/img/*.*")
        .pipe(flatmap(function(stream, file) {
			var filename = path.basename(file.path);
            var wstream = fs.createWriteStream("../../src/webh/" + filename + ".h");
            wstream.on("error", function(err) {
                console.error(err);
            });
			var data = file.contents;
            wstream.write("#define " + filename.replace(/\.|-/g, "_") + "_len " + data.length + "\n");
            wstream.write("const uint8_t " + filename.replace(/\.|-/g, "_") + "[] PROGMEM = {")
            
            for (i = 0; i < data.length; i++) {
                if (i % 1000 == 0) wstream.write("\n");
                wstream.write('0x' + ('00' + data[i].toString(16)).slice(-2));
                if (i < data.length - 1) wstream.write(',');
            }

            wstream.write("\n};")
            wstream.end();

            return stream;
        }));
}

function htmlgz() {
	return gulp.src("../../src/websrc/html/*.*")
        .pipe(gulp.dest("../../src/websrc/html/"))
            .pipe(gzip({
                append: true
            }))
        .pipe(gulp.dest('../../src/websrc/gzipped/html/'));
}

function htmls() {
    return gulp.src("../../src/websrc/gzipped/html/*.*")
        .pipe(flatmap(function(stream, file) {
			var filename = path.basename(file.path);
            var wstream = fs.createWriteStream("../../src/webh/" + filename + ".h");
            wstream.on("error", function(err) {
                console.error(err);
            });
			var data = file.contents;
            wstream.write("#define " + filename.replace(/\.|-/g, "_") + "_len " + data.length + "\n");
            wstream.write("const uint8_t " + filename.replace(/\.|-/g, "_") + "[] PROGMEM = {")
            
            for (i = 0; i < data.length; i++) {
                if (i % 1000 == 0) wstream.write("\n");
                wstream.write('0x' + ('00' + data[i].toString(16)).slice(-2));
                if (i < data.length - 1) wstream.write(',');
            }

            wstream.write("\n};")
            wstream.end();

            return stream;
        }));
}

const dirsTask = gulp.series(createFolders);
const styleTasks = gulp.series(stylesConcat, styles);
const scriptTasks = gulp.series(scriptsgz, scripts);
const fontTasks = gulp.series(fontgz, fonts);
const imgTasks = gulp.series(imggz, imgs);
const htmlTasks = gulp.series(htmlgz, htmls);

exports.default = gulp.series(dirsTask, styleTasks, scriptTasks, fontTasks, imgTasks, htmlTasks);