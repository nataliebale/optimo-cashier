import * as archiver from 'archiver';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import { Constants } from '../Constants';

export class Archive {
  private static pad(s) {
    return s < 10 ? '0' + s : s;
  }

  static async logs() {
    const dir = Constants.UserData + '/logs';
    console.log(dir);
    const date = new Date();
    const dateString = `${[
      Archive.pad(date.getDate()),
      Archive.pad(date.getMonth() + 1),
      date.getFullYear(),
    ].join('-')} ${[Archive.pad(date.getHours()), Archive.pad(date.getMinutes())].join('')}`;
    const file = `${dir}/log.${dateString}.zip`;

    if (fs.existsSync(dir)) {
      try {
        fs.utimesSync(file, date, date);
      } catch (err) {
        fs.closeSync(fs.openSync(file, 'w'));
      }

      const output = fs.createWriteStream(file);
      const archivator = archiver('zip', { zlib: { level: 9 } });

      archivator.pipe(output);
      archivator.glob(`*.txt`, { cwd: dir });
      archivator.glob(`*.log`, { cwd: dir });

      try {
        await archivator.finalize();
      } catch (e) {
        console.error(e);
      }

      await new Promise((resolve, reject) => {
        rimraf(`${dir}/*.txt`, resolve);
      });

      await new Promise((resolve, reject) => {
        rimraf(`${dir}/*.log`, resolve);
      });
    }
  }
}
