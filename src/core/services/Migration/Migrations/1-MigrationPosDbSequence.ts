import { Container } from 'inversify';
import { ApplicationDb } from '../../../infrastructure/ApplicationDb';
import { TransactionDb } from '../../../infrastructure/TransactionDb';

export default class MigrationPosDbSequence {
  public async run(diConainer: Container) {
    const db = diConainer.get(ApplicationDb);
    const transactionDb = diConainer.get(TransactionDb);
    // transaction seq
    const sequences = await db.query('SELECT * FROM sqlite_sequence');
    await transactionDb.query('DELETE FROM sqlite_sequence');
    for (const sequence of sequences) {
      await transactionDb.query(`
        INSERT INTO sqlite_sequence(name, seq)
        VALUES('${sequence.name}', ${sequence.seq})
      `);
    }

    const lastTransaction = await db.transactionLogRepository.findOne({ order: { id: 'DESC' } });
    if (lastTransaction) {
      await transactionDb.transactionLogRepository.save(lastTransaction);
    }

    const lastEntityTransaction = await db.entityTransactionLogRepository.findOne({
      order: { id: 'DESC' },
    });
    if (lastEntityTransaction) {
      await transactionDb.entityTransactionLogRepository.save(lastEntityTransaction);
    }
  }
}
