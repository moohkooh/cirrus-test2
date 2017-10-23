var compressor = require('node-minify');
// Using UglifyJS
compressor.minify({
    compressor: 'uglifyjs',
    input: '../../src/server/server.js',
    output: '../../dist/server.js',
    callback: function (err, min) { 
        if(err){
            console.error(err);
        }
        console.info("Build success!");
    }
});
