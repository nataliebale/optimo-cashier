var exec = require('child_process').exec;
var systemRoot = process.env.SystemRoot || 'C:\\Windows';
var utility = systemRoot + '\\System32\\netsh.exe';

export function parse(terms, str) {
    var lines = str.split('\n');
    var wifis = [];
    var info: any = {};
    var line;
    var ssid;
    var fields = {
        'mac': new RegExp('^' + terms.BSSID + ' \\d+\\s*:\\s*(.+)'),
        'ssid': new RegExp('^' + terms.SSID + ' \\d+\\s*:\\s*(.*)'),
        'signal_level': new RegExp('^' + terms.Signal + '\\s*:\\s*(\\d+)'),
        'channel': new RegExp('^' + terms.Channel + '\\s*:\\s*(\\d+)'),
        'signal': new RegExp('^' + terms.Signal + '\\s*:\\s*(\\d+)'),
        'authentication': new RegExp('^' + terms.Authentication + '\\s*:\\s*(.+)')
    };

    for (var i = 0, l = lines.length; i < l; i++) {
        line = lines[i].trim();

        if (!line.length) {
            continue;
        }

        else if (line.match(fields.ssid)) {
            if (info.ssid) {
                wifis.push(info);
            }
            info = {};
            info.ssid = fields.ssid.exec(line)[1];
        }

        else if (line.match(fields.mac)) {
            info.mac = fields.mac.exec(line)[1];
        }

        else if (line.match(fields.signal_level)) {
            info.signal = parseInt(fields.signal_level.exec(line)[1]);

            // According to http://stackoverflow.com/q/15797920
            // Microsoft's signal quality is 0 to 100,
            //   representing RSSI values between -100 and -50 dbm.
            info.signal_level = (info.signal / 2) - 100;

        }
        else if (line.match(fields.channel)) {
            info.channel = fields.channel.exec(line)[1];
        }
        else if (line.match(fields.authentication)) {
            info.authentication = fields.authentication.exec(line)[1];
        }
    }

    if (info.ssid) {
        wifis.push(info);
    }
    return wifis;
}

export function scan(terms, callback) {
    exec(utility + ' wlan show networks mode=Bssid', function (err, stdout, stderr) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, parse(terms, stdout));
    });
}

export { utility };
