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
import {
  Check,
  EntityTransaction,
  EntityTransactionLog,
  IMEI,
  Operator,
  OperatorSession,
  OperatorSessionAction,
  OperatorSessionLog,
  PurchaseOrder,
  PurchaseOrderLine,
  ReceivedPurchaseOrder,
  ReceivedPurchaseOrderLog,
  SettingsEntity,
  Shift,
  ShiftLog,
  StockItem,
  StockItemCategory,
  Supplier,
  Totp,
  Transaction,
  TransactionLog,
  CashWithdrawal,
  ClockDriftLog,
  ClockDriftWarningLog,
  ShiftAction,
  CashWithdrawalLog,
  EntityClient,
  Space,
  Table,
  MigrationLog,
  ReturnTransaction,
  ReturnTransactionLog,
} from './Entities';

@injectable()
export class ApplicationDb {
  private _connection: Connection;

  private _operatorRepository: Repository<Operator>;
  private _operatorLoginRepository: Repository<OperatorSession>;
  private _operatorLoginActionRepository: Repository<OperatorSessionAction>;
  private _operatorSessionLogRepository: Repository<OperatorSessionLog>;
  private _stockItemRepository: Repository<StockItem>;
  private _transactionRepository: Repository<Transaction>;
  private _transactionLogRepository: Repository<TransactionLog>;
  private _stockItemCategoryRepository: Repository<StockItemCategory>;
  private _supplierRepository: Repository<Supplier>;
  private _purchaseOrderRepository: Repository<PurchaseOrder>;
  private _purchaseOrderLineRepository: Repository<PurchaseOrderLine>;
  private _receivedPurchaseOrderRepository: Repository<ReceivedPurchaseOrder>;
  private _receivedPurchaseOrderLogRepository: Repository<ReceivedPurchaseOrderLog>;
  private _shiftRepository: Repository<Shift>;
  private _shiftLogRepository: Repository<ShiftLog>;
  private _shiftActionRepository: Repository<ShiftAction>;
  private _settingsRepository: Repository<SettingsEntity>;
  private _entityTransactionRepository: Repository<EntityTransaction>;
  private _entityTransactionLogRepository: Repository<EntityTransactionLog>;
  private _totpRepository: Repository<Totp>;
  private _imeiRepository: Repository<IMEI>;
  private _checkRepository: Repository<Check>;
  private _cashWithdrawalRepository: Repository<CashWithdrawal>;
  private _cashWithdrawalLogRepository: Repository<CashWithdrawalLog>;
  private _clockDriftLogRepository: Repository<ClockDriftLog>;
  private _clockDriftWarningLogRepository: Repository<ClockDriftWarningLog>;
  private _entityClientRepository: Repository<EntityClient>;
  private _spaceRepository: Repository<Space>;
  private _tableRepository: Repository<Table>;
  private _migrationLogRepository: Repository<MigrationLog>;
  private _returnTransactionRepository: Repository<ReturnTransaction>;
  private _returnTransactionLogRepository: Repository<ReturnTransactionLog>;

  transaction<T>(runInTransaction: (entityManager: EntityManager) => Promise<T>) {
    return this._connection.transaction(runInTransaction);
  }

  public query(query: string, parameters?: any[], queryRunner?: QueryRunner): Promise<any> {
    return this._connection.query(query, parameters, queryRunner);
  }

  get operatorRepository(): Repository<Operator> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._operatorRepository) {
      this._operatorRepository = this._connection.getRepository(Operator);
    }

    return this._operatorRepository;
  }

  get operatorSessionRepository(): Repository<OperatorSession> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._operatorLoginRepository) {
      this._operatorLoginRepository = this._connection.getRepository(OperatorSession);
    }

    return this._operatorLoginRepository;
  }

  get operatorSessionActionRepository(): Repository<OperatorSessionAction> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._operatorLoginActionRepository) {
      this._operatorLoginActionRepository = this._connection.getRepository(OperatorSessionAction);
    }

    return this._operatorLoginActionRepository;
  }

  get operatorSessionLogRepository(): Repository<OperatorSessionLog> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._operatorSessionLogRepository) {
      this._operatorSessionLogRepository = this._connection.getRepository(OperatorSessionLog);
    }

    return this._operatorSessionLogRepository;
  }

  get clockDriftLogRepository(): Repository<ClockDriftLog> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._clockDriftLogRepository) {
      this._clockDriftLogRepository = this._connection.getRepository(ClockDriftLog);
    }

    return this._clockDriftLogRepository;
  }

  get clockDriftWarningLogRepository(): Repository<ClockDriftWarningLog> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._clockDriftWarningLogRepository) {
      this._clockDriftWarningLogRepository = this._connection.getRepository(ClockDriftWarningLog);
    }

    return this._clockDriftWarningLogRepository;
  }

  get stockItemRepository(): Repository<StockItem> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._stockItemRepository) {
      this._stockItemRepository = this._connection.getRepository(StockItem);
    }

    return this._stockItemRepository;
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

  get stockItemCategoryRepository(): Repository<StockItemCategory> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._stockItemCategoryRepository) {
      this._stockItemCategoryRepository = this._connection.getRepository(StockItemCategory);
    }

    return this._stockItemCategoryRepository;
  }

  get supplierRepository(): Repository<Supplier> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._supplierRepository) {
      this._supplierRepository = this._connection.getRepository(Supplier);
    }

    return this._supplierRepository;
  }

  get purchaseOrderRepository(): Repository<PurchaseOrder> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._purchaseOrderRepository) {
      this._purchaseOrderRepository = this._connection.getRepository(PurchaseOrder);
    }

    return this._purchaseOrderRepository;
  }

  get purchaseOrderLineRepository(): Repository<PurchaseOrderLine> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._purchaseOrderLineRepository) {
      this._purchaseOrderLineRepository = this._connection.getRepository(PurchaseOrderLine);
    }

    return this._purchaseOrderLineRepository;
  }

  get receivedPurchaseOrderRepository(): Repository<ReceivedPurchaseOrder> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._receivedPurchaseOrderRepository) {
      this._receivedPurchaseOrderRepository = this._connection.getRepository(ReceivedPurchaseOrder);
    }

    return this._receivedPurchaseOrderRepository;
  }

  get receivedPurchaseOrderLogRepository(): Repository<ReceivedPurchaseOrderLog> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._receivedPurchaseOrderLogRepository) {
      this._receivedPurchaseOrderLogRepository = this._connection.getRepository(
        ReceivedPurchaseOrderLog
      );
    }

    return this._receivedPurchaseOrderLogRepository;
  }

  get shiftRepository(): Repository<Shift> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._shiftRepository) {
      this._shiftRepository = this._connection.getRepository(Shift);
    }

    return this._shiftRepository;
  }

  get shiftLogRepository(): Repository<ShiftLog> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._shiftLogRepository) {
      this._shiftLogRepository = this._connection.getRepository(ShiftLog);
    }

    return this._shiftLogRepository;
  }

  get shiftActionRepository(): Repository<ShiftAction> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._shiftActionRepository) {
      this._shiftActionRepository = this._connection.getRepository(ShiftAction);
    }

    return this._shiftActionRepository;
  }

  get checkRepository(): Repository<Check> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._checkRepository) {
      this._checkRepository = this._connection.getRepository(Check);
    }

    return this._checkRepository;
  }

  get cashWithdrawalRepository(): Repository<CashWithdrawal> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._cashWithdrawalRepository) {
      this._cashWithdrawalRepository = this._connection.getRepository(CashWithdrawal);
    }

    return this._cashWithdrawalRepository;
  }

  get cashWithdrawalLogRepository(): Repository<CashWithdrawalLog> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._cashWithdrawalLogRepository) {
      this._cashWithdrawalLogRepository = this._connection.getRepository(CashWithdrawalLog);
    }

    return this._cashWithdrawalLogRepository;
  }

  get settingsRepository(): Repository<SettingsEntity> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._settingsRepository) {
      this._settingsRepository = this._connection.getRepository(SettingsEntity);
    }

    return this._settingsRepository;
  }

  get migrationLogRepository(): Repository<MigrationLog> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._migrationLogRepository) {
      this._migrationLogRepository = this._connection.getRepository(MigrationLog);
    }

    return this._migrationLogRepository;
  }

  get entityClientRepository(): Repository<EntityClient> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._entityClientRepository) {
      this._entityClientRepository = this._connection.getRepository(EntityClient);
    }

    return this._entityClientRepository;
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

  get totpRepository(): Repository<Totp> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._totpRepository) {
      this._totpRepository = this._connection.getRepository(Totp);
    }

    return this._totpRepository;
  }

  get imeiRepository(): Repository<IMEI> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._imeiRepository) {
      this._imeiRepository = this._connection.getRepository(IMEI);
    }

    return this._imeiRepository;
  }

  get spaceRepository(): Repository<Space> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._spaceRepository) {
      this._spaceRepository = this._connection.getRepository(Space);
    }

    return this._spaceRepository;
  }

  get tableRepository(): Repository<Table> {
    if (!this._connection) {
      throw new Error('Please init database first');
    }

    if (!this._tableRepository) {
      this._tableRepository = this._connection.getRepository(Table);
    }

    return this._tableRepository;
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
        this._connection = getConnection();
      } catch (_) {
        this._connection = await createConnection();
      }
      await this.migrate();
    }
  }

  private async migrate() {
    if (!this._connection) {
      this._connection = await createConnection();
    }

    log.info('ბაზის სტრუქტურის განახლება');
    await this._connection.query('PRAGMA foreign_keys = 0;');
    let checkSequence = 0;
    try {
      checkSequence = (
        await this._connection.query(
          `SELECT coalesce("seq",0) seq FROM sqlite_sequence WHERE name = 'check'`
        )
      )[0].seq;
    } catch {}
    await this._connection.runMigrations();
    await this._connection.query(`
      UPDATE sqlite_sequence
      SET seq = ${checkSequence}
      WHERE name = 'check'
    `);
    await this.updateAutoIncrements('transaction', 'transaction_log');
    await this.updateAutoIncrements('entity_transaction', 'entity_transaction_log');
    await this.updateAutoIncrements('shift', 'shift_log');
    await this.updateAutoIncrements('received_purchase_order', 'received_purchase_order_log');
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
        SET seq = (SELECT max('a1'.seq, 'a2'.seq) seq
                    FROM (SELECT coalesce(seq, 0) seq FROM sqlite_sequence WHERE name = '${tableName}') 'a1' 
                    LEFT JOIN (SELECT coalesce(max('tl'.'id'), 0) seq FROM '${sourceTableName}' 'tl') 'a2' ON TRUE)
      WHERE name = '${tableName}';
    `);
  }
}
