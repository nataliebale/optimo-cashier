var exec = require('child_process').exec;
var util = require('util');
var utility = '/usr/bin/nmcli';

var fields = {
    'SSID': 'ssid',
    'BSSID': 'mac',
    'CHAN': 'channel'
};

export function parse(terms, str) {
    var out = str.split('\n');
    var cells = [];
    var info = {};

    var linesPerCell = Object.keys(fields).length;
    for (var i=0, l=out.length; i<l; i++) {
        var line = out[i].trim();
        if (!line.length) {
            continue;
        }

        if(i % linesPerCell == 0) {
            cells.push(info);
            info = {};
        }
        var components = line.split(":");
        var fieldName = components.shift();
        var fieldValue = components.join(":");

        var cellField = fields[terms[fieldName]];

        info[cellField] = fieldValue.trim();
    }
    cells.push(info);
    cells.shift();
    return cells;
}

export function scan(terms, callback) {
    exec(utility + ' device wifi rescan', function (err, stdout, stderr) {
        var fieldNames = Object.keys(fields).join(",");
        exec(utility + ' --terse --mode multiline --fields ' + fieldNames + ' device wifi', function (err, stdout, stderr) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, parse(terms, stdout));
        });
    });
}

export { utility };
