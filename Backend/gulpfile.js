var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

var jsFiles = ['*.js'];

gulp.task('serve', () => {
    var options = {
        script: 'app.js',
        delayTime: 1,
        env: {
         'PORT': 8000
        },
        watch: jsFiles
    };
    return nodemon(options)
    .on('restart', (ev) => {
        console.log('Restarting....');
    });
});