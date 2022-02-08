require('v8-compile-cache');
const appStartTime = new Date().getTime();
process.env.EDGE_DEBUG = '1';
export { appStartTime };

import { protocol, app } from 'electron';
import * as log from 'electron-log';
import { Archive } from '../core/infrastructure/Archive';
import { ElectronApp } from './infrastructure/ElectronApp';

Object.assign(console, log.functions);

process.env.APP_TYPE = 'electron';
process.env.UserData = app.getPath('userData');

protocol.registerSchemesAsPrivileged([
  { scheme: 'cached-images', privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);
log.transports.file.level = 'verbose';
log.transports.console.level = 'debug';
log.transports.file.maxSize = 50048576;

process.on('uncaughtException', function (error) {
  // tslint:disable-next-line: no-console
  console.trace(error);
  log.error('გაუთვალისწინებელი შეცდომა', error, error.stack);
});
process.on('unhandledRejection', function (error) {
  // tslint:disable-next-line: no-console
  console.trace(error);
  log.error('გაუთვალისწინებელი შეცდომა', error);
});

const args = process.argv.slice(1);

if (args.some((val) => val === '--serve')) {
  process.env.SERVE = 'true';
}

if (!args.some((val) => val === '--no-update')) {
  process.env.UPDATE = 'UPDATE';
}
(async () => {
  await app.whenReady();
  await Archive.logs();
  log.log('_____BOOT_____');
  log.log('EDGE_DEBUG', process.env.EDGE_DEBUG);
  await new ElectronApp().Start();
  log.log('App Start Time: ', (new Date().getTime() - appStartTime) / 1000);
})();
