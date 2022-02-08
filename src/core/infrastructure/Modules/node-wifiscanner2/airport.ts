var exec = require('child_process').exec;
var utility = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport';

export function parse(terms, str) {
    var lines = str.split('\n');
    var colSsid = 0;
    var colMac = lines[0].indexOf(terms.BSSID);
    var colRssi = lines[0].indexOf(terms.RSSI);
    var colChannel = lines[0].indexOf(terms.CHANNEL);
    var colHt = lines[0].indexOf(terms.HT);
    var colSec = lines[0].indexOf(terms.SECURITY);
    //var colCC = lines[0].indexOf(terms.CC);

    var wifis = [];
    for (var i = 1, l = lines.length; i < l; i++) {
        wifis.push({
            'mac': lines[i].substr(colMac, colRssi - colMac).trim(),
            'ssid': lines[i].substr(0, colMac).trim(),
            'channel': lines[i].substr(colChannel, colHt - colChannel).trim(),
            'signal_level': lines[i].substr(colRssi, colChannel - colRssi).trim(),
            'security': lines[i].substr(colSec).trim()
        });
    }
    wifis.pop();
    return wifis;
}

export function scan(terms, callback) {
    exec(utility + ' -s', function (err, stdout, stderr) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, parse(terms, stdout));
    });
}

export { utility };
