var plato = require('plato');

var files = [
    'drone.js',

];

var outputDir = './output/dir';
// null options for this example
var options = {
    title: 'Drone AE Project'
};

var callback = function (report){
// once done the analysis,
// execute this
};

plato.inspect(files, outputDir, options, callback);