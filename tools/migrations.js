var fs = require("fs");
const rimraf = require('rimraf');

rimraf('../services/**/*.js', function () { console.log('done'); });
rimraf('../shared/**/*.js', function () { console.log('done'); });

fs.unlink('database.migrations.sqlite', function(err) {
    
})