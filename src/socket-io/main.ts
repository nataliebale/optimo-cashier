require('v8-compile-cache');
const appStartTime = new Date().getTime();
export { appStartTime };

import * as log from 'electron-log';
import { Archive } from '../core/infrastructure/Archive';
import { SocketApp } from './SocketApp';

process.env.APP_TYPE = 'node';
process.env.UserData = `${
  process.env.APPDATA || (
    process.platform == 'darwin' ?
      process.env.HOME + '/Library/Preferences' :
      process.env.HOME + '/.local/share'
  )}/Optimo`;

log.transports.file.level = 'verbose';
log.transports.console.level = 'debug';

const args = process.argv.slice(1);

if (args.some(val => val === '--serve')) {
  process.env.SERVE = 'true';
}

if (!args.some(val => val === '--no-update')) {
  process.env.UPDATE = 'UPDATE';
}

(async () => {
  await Archive.logs();
  log.log('_____BOOT_____');
  await new SocketApp().Start();
  log.log('App Start Time: ', (new Date().getTime() - appStartTime) / 1000);
})();

