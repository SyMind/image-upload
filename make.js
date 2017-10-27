const shell = require('shelljs'),
      path  = require('path'),
      fs    = require('fs');

let arguments = process.argv.splice(2);

let zepto_js = 'dist/zepto.js';
    zepto_min = 'dist/zepto.min.js';

var fn = {
    build: function() {
        shell.cd(__dirname);
        shell.mkdir('-p', 'dist');
        var modules = 'kepto.imageupload'.split(' ');
        var module_files = new Array();
        for(let module of modules) 
            module_files.push(`src/${module}.js`);
        var dist = shell.cat(module_files.join(' '));
        shell.ShellString(dist).to(zepto_js);
    }
};

/* tasks */
fn.toZeptoJs = function() {

}

fn.toZeptoMin = function() {

}


/* helper */
let stale = function(file, source) {
    
};

let fsize = (file) => 
    fs.statSync(file).size;


let format_number = (size, precision = 1) => {
    let factor = Math.pow(10, precision),
        decimal = Math.round(size * factor) % factor;
    return parseInt(size) + '.' + decimal;
}

var report_size = function(file) {
    shell.echo(`${file}: ${format_number(fsize(file) / 1024)} KiB`);
}

/* program */

fn.build();

