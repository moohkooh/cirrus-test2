var compressor = require('node-minify');
// Using UglifyJS
compressor.minify({
    compressor: 'uglifyjs',
    input: '../../src/server/server.js',
    output: '../../dist/server.js',
    options: {
        warnings: true, // pass true to display compressor warnings.
        mangle: false, // pass false to skip mangling names.
        compress: true // pass false to skip compressing entirely. Pass an object to specify custom compressor options.
    },
    callback: function (err, min) {
        if (err) {
            console.error(err);
        }
        console.info("Build success!");
    }
});
