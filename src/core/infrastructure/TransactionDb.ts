import { ReturnTransactionLog } from './Entities/Transaction/ReturnTransactionLog';
import { ReturnTransaction } from './Entities/Transaction/ReturnTransaction';
import { TransactionLogOrderLine } from './Entities';
import * as log from 'electron-log';
import { injectable } from 'inversify';
import {
  Connection,
  createConnection,
  EntityManager,
  QueryRunner,
  Repository,
  getConnection,
} from 'typeorm';
import { EntityTransaction, EntityTransactionLog, Transaction, TransactionLog } from './Entities';

@injectable()
export class TransactionDb {
  private _connection: Connection;
  private _transactionRepository: Repository<Transaction>;
  private _transactionLogRepository: Repository<TransactionLog>;
  private _transactionLogOrderLineRepository: Repository<TransactionLogOrderLine>;
  private _entityTransactionRepository: Repository<EntityTransaction>;
  private _entityTransactionLogRepository: Repository<EntityTransactionLog>;
  private _returnTransactionRepository: Repository<ReturnTransaction>;
  private _returnTransactionLogRepository: Repository<ReturnTransactionLog>;

  transaction<T>(runInTransaction: (entityManager: EntityManager) => Promise<T>) {
    return this._connection.transaction(runInTransaction);
  }

  public query(query: string, parameters?: any[], queryRunner?: QueryRunner): Promise<any> {
    return this._connection.query(query, parameters, queryRunner);
  }

  get transactionRepository(): Repository<Transaction> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._transactionRepository) {
      this._transactionRepository = this._connection.getRepository(Transaction);
    }

    return this._transactionRepository;
  }

  get transactionLogRepository(): Repository<TransactionLog> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._transactionLogRepository) {
      this._transactionLogRepository = this._connection.getRepository(TransactionLog);
    }

    return this._transactionLogRepository;
  }

  get transactionLogOrderLineRepository(): Repository<TransactionLogOrderLine> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._transactionLogOrderLineRepository) {
      this._transactionLogOrderLineRepository = this._connection.getRepository(
        TransactionLogOrderLine
      );
    }

    return this._transactionLogOrderLineRepository;
  }

  get entityTransactionRepository(): Repository<EntityTransaction> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._entityTransactionRepository) {
      this._entityTransactionRepository = this._connection.getRepository(EntityTransaction);
    }

    return this._entityTransactionRepository;
  }

  get entityTransactionLogRepository(): Repository<EntityTransactionLog> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._entityTransactionLogRepository) {
      this._entityTransactionLogRepository = this._connection.getRepository(EntityTransactionLog);
    }

    return this._entityTransactionLogRepository;
  }

  get returnTransactionRepository(): Repository<ReturnTransaction> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._returnTransactionRepository) {
      this._returnTransactionRepository = this._connection.getRepository(ReturnTransaction);
    }

    return this._returnTransactionRepository;
  }

  get returnTransactionLogRepository(): Repository<ReturnTransactionLog> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._returnTransactionLogRepository) {
      this._returnTransactionLogRepository = this._connection.getRepository(ReturnTransactionLog);
    }

    return this._returnTransactionLogRepository;
  }

  async Init() {
    if (!this._connection) {
      try {
        this._connection = getConnection('transactiondb');
      } catch (_) {
        this._connection = await createConnection('transactiondb');
      }
      await this.migrate();
    }
  }

  private async migrate() {
    if (!this._connection) {
      try {
        this._connection = getConnection('transactiondb');
      } catch (_) {
        this._connection = await createConnection('transactiondb');
      }
    }

    log.info('ბაზის სტრუქტურის განახლება');
    await this._connection.query('PRAGMA foreign_keys = 0;');
    await this._connection.runMigrations();
    await this.updateAutoIncrements('transaction', 'transaction_log');
    await this.updateAutoIncrements('entity_transaction', 'entity_transaction_log');
    await this._connection.query('PRAGMA foreign_keys = 1;');
  }

  async updateAutoIncrements(tableName: string, sourceTableName: string) {
    await this._connection.query(`
     INSERT INTO sqlite_sequence(name, seq)
     SELECT '${tableName}', 0
      WHERE NOT EXISTS(SELECT * FROM sqlite_sequence WHERE name = '${tableName}')
    `);
    await this._connection.query(`
     UPDATE sqlite_sequence
        SET seq = (SELECT coalesce(max('tl'.'id'), 0) FROM '${sourceTableName}' 'tl')
      WHERE name = '${tableName}';
    `);
  }
}
