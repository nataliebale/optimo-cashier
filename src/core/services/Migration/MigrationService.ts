import { Container } from 'inversify';
import * as fs from 'fs';
import * as path_module from 'path';
import { ApplicationDb } from '../../infrastructure/ApplicationDb';
import { MigrationLog } from '../../infrastructure/Entities';

export class MigrationService {
  private static modules = [];

  public static async Run(_diContainer: Container) {
    const db = _diContainer.get(ApplicationDb);
    this.loadModules(__dirname + '/Migrations');

    for (const module of this.modules) {
      const found = await db.migrationLogRepository.find({ name: module['name'] });
      if (!found || !found.length) {
        const migration = new module['reference']();
        await migration.run(_diContainer);
        await db.migrationLogRepository.save(MigrationLog.CreateNew(module['name']));
      }
    }
  }

  private static loadModules(path: string) {
    const stat = fs.lstatSync(path);
    if (stat.isDirectory()) {
      const files = fs.readdirSync(path);
      for (let i = 0; i < files.length; i++) {
        const module = path_module.join(path, files[i]);
        this.loadModules(module);
      }
    } else {
      if (path.endsWith('.js')) {
        const pathArray = path.split('\\');
        const name = pathArray[pathArray.length - 1].split('.')[0];
        this.modules.push({ name, reference: require(path).default });
      }
    }
  }
}
