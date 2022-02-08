import { UserDetailsDTO } from './models/UserDetailsDTO';
import { ClockService } from './../Clock/ClockService';
import { EntityClient } from './../../infrastructure/Entities';
import { EntityClientDTO } from './models/EntityClientDTO';
import { LocationDTO } from './models/LocationDTO';
import { Transaction } from './../../infrastructure/Entities';
import { ShiftActionType } from './../../infrastructure/Entities';
import log from 'electron-log';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import * as request from 'request';
import { OdinEvent } from '../../../shared/enums/OdinEvent';
import { IStockItem } from '../../../shared/types/IStockItem';
import { ISupplier } from '../../../shared/types/ISupplier';
import { ApplicationDb } from '../../infrastructure/ApplicationDb';
import {
  PurchaseOrder,
  PurchaseOrderLine,
  StockItem,
  StockItemCategory,
  Supplier,
  IMEI,
  Operator,
  EntityTransaction,
} from '../../infrastructure/Entities';
import { HttpAdapter } from '../Http/HttpAdapter';
import { SettingsService } from '../Settings/SettingService';
import { SystemEventService } from '../SystemEvent/SystemEventService';
import { UpdateService } from '../Update/UpdateService';
import { IMEIDTO } from './models/IMEIDTO';
import { OperatorDTO } from './models/OperatorDTO';
import { PopularProductDTO } from './models/PopularProductDTO';
import { PurchaseOrderDTO } from './models/PurchaseOrderDTO';
import { StockItemCategoryCategoryDTO } from './models/StockItemCategoryCategoryDTO';
import { StockItemDTO } from './models/StockItemDTO';
import { SupplierDTO } from './models/SupplierDTO';
import { SupplierStockItemsDTO } from './models/SupplierStockItemsDTO';
import { OperatorSessionActionType } from '../../infrastructure/Entities';
import { SpaceDTO } from './models/SpaceDTO';
import { TransactionDb } from '../../infrastructure/TransactionDb';
import { Constants } from '../../Constants';
import { ReturnTransaction } from '../../infrastructure/Entities/Transaction/ReturnTransaction';

@injectable()
export class SynchronizationService {
  static readonly PIPE_PATH = '\\\\.\\pipe\\Odin.Service';
  private _synced = false;

  private get _popularSynced(): Date {
    return this._settings.data.popularSyncDate;
  }

  constructor(
    @inject(ApplicationDb) private readonly _db: ApplicationDb,
    @inject(TransactionDb) private readonly _transactionDb: TransactionDb,
    @inject(HttpAdapter) private readonly _httpAdapter: HttpAdapter,
    @inject(SystemEventService)
    private readonly _eventService: SystemEventService,
    @inject(SettingsService) private readonly _settings: SettingsService,
    @inject(UpdateService) private readonly _updateService: UpdateService,
    @inject(ClockService) private readonly _clockService: ClockService
  ) {}

  async getLastSyncDate() {
    return this._settings.data.syncDate;
  }

  async sync(retry: boolean = false, isOnBoot = false) {
    log.info('სინქრონიზაციის დაწყება');
    const now = new Date(new Date().getTime() - 300000);

    if (retry && this._synced) {
      return true;
    }

    if (!this._httpAdapter.isOnline) {
      log.warn('მოწყობილობა ოფლაინშია');
      this._synced = false;
      this._eventService.sendEvent(OdinEvent.SYNCED, false);

      return false;
    }

    try {
      this._eventService.sendEvent(OdinEvent.BOOT, 'განახლების შემოწმება');
      const readyToInstall = await this._updateService.runUpdateCheckers();

      if (readyToInstall && isOnBoot) {
        return this._updateService.installUpdate();
      }
    } catch (err) {
      log.error(err);
      log.error(err.stack);
    }

    this._synced =
      (await this.checkTimeDrift()) &&
      (await this.syncTransactions()) &&
      (await this.syncEntityTransactions()) &&
      (await this.syncReturnTransactions()) &&
      (await this.syncReceivedOrders()) &&
      (await this.syncLegalEntityData()) &&
      (await this.syncOperators()) &&
      (await this.syncEntityClients()) &&
      (await this.syncOperatorSessionActions()) &&
      (await this.syncShifts()) &&
      (await this.syncShiftActions()) &&
      (await this.syncCashWithdrawals()) &&
      (await this.syncStockItemCategories()) &&
      (await this.syncStockItems()) &&
      (await this.syncImei()) &&
      (await this.syncSuppliers()) &&
      (await this.syncSupplierStockItems(isOnBoot)) &&
      (await this.syncPurchaseOrders()) &&
      (await this.syncSpaces()) &&
      (await this.syncLocationAddress()) &&
      ((new Date().getTime() - this._popularSynced.getTime()) / 1000 > 79200
        ? await this.syncPopularProducts()
        : true);

    log.info('სინქრონიზაციის სტატუსის შეტყობინების გაგზავნა');
    this._eventService.sendEvent(OdinEvent.SYNCED, this._synced);

    if (this._synced) {
      await this._settings.setProperty((p) => (p.syncDate = now));
    }

    return this._synced;
  }

  async checkTimeDrift() {
    log.info('საათის შემოწმება');
    try {
      await this._clockService.checkClockDriftAsync();
    } catch (err) {
      log.warn('საათის შემოწმების შეცდომა', err, err.stack);
      log.warn(err);
      log.warn(err.stack);
    }
    return true;
  }

  async syncTransactions() {
    log.info('გაყიდვების სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'გაყიდვების სინქრონიზაცია');
    try {
      // move transactions to application db
      let posTransactions: Transaction[] = null;
      do {
        posTransactions = await this._transactionDb.transactionRepository
          .createQueryBuilder()
          .take(100)
          .getMany();
        await this._db.transactionRepository.save(posTransactions);
        const posTransactionIds = posTransactions.map((t) => t.id);
        await this._transactionDb.query(`
        DELETE FROM 'transaction' WHERE 'transaction'.'id' in (${posTransactionIds.join(',')})
      `);
      } while (posTransactions && posTransactions.length);
      const transactions = await this._db.transactionRepository.find();
      for (const transaction of transactions) {
        try {
          await this._httpAdapter.post(this._httpAdapter.API_SALE, transaction, true);
          await this._db.transactionRepository.delete(transaction.id);
        } catch (err) {
          console.error('sale sync error: ', err);
          log.error('გაყიდვის სინქრონიზაციის შეცდომა', err, err.stack);
          return false;
        }
      }

      return true;
    } catch (err) {
      log.error('გაყიდვის სინქრონიზაციის შეცდომა', err, err.stack);
      log.error(err);
      log.error(err.stack);
      return false;
    }
  }
  async syncReturnTransactions() {
    log.info('დაბრუნებული გაყიდვების სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'დაბრუნებული გაყიდვების სინქრონიზაცია');
    try {
      // move transactions to application db
      let posTransactions: ReturnTransaction[] = null;
      do {
        posTransactions = await this._transactionDb.returnTransactionRepository
          .createQueryBuilder()
          .where('status = 5')
          .take(100)
          .getMany();
        await this._db.returnTransactionRepository.save(posTransactions);
        const posTransactionIds = posTransactions.map((t) => `"${t.id}"`);
        await this._transactionDb.query(`
        DELETE FROM 'return_transaction' WHERE 'return_transaction'.'id' in (${posTransactionIds.join(
          ','
        )})
      `);
      } while (posTransactions && posTransactions.length);
      const transactions = await this._db.returnTransactionRepository.find();
      // log.info('dev => ტრანზაქციები სინქრონიზაციისთვის:', transactions);
      for (const transaction of transactions) {
        try {
          await this._httpAdapter.post(this._httpAdapter.API_RETURN_SALE, transaction, true);
          await this._db.returnTransactionRepository.delete(transaction.id);
        } catch (err) {
          console.error('sale sync error: ', err);
          log.error('დაბრუნებული გაყიდვის სინქრონიზაციის შეცდომა', err, err.stack);
          return false;
        }
      }

      return true;
    } catch (err) {
      log.error('დაბრუნებული გაყიდვის სინქრონიზაციის შეცდომა', err, err.stack);
      log.error(err);
      log.error(err.stack);
      return false;
    }
  }

  async syncEntityClients() {
    log.info('მყიდველების სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'მყიდველების სინქრონიზაცია');
    try {
      const date = this._settings.data.isEntityClientFirstTimeSynced
        ? this._settings.data.syncDate.toISOString()
        : new Date(0).toISOString();
      const result = await this._httpAdapter.get(
        `${this._httpAdapter.API_ENTITY_CLIENTS}?dateModifiedFrom=${date}`,
        true
      );
      const entityClients = JSON.parse(result) as EntityClientDTO[];
      let clientsToBeSaved: EntityClient[] = [];

      for (const entityClient of entityClients) {
        clientsToBeSaved.push(
          EntityClient.CreateNew(
            entityClient.id,
            entityClient.entityIdentifier,
            entityClient.entityName,
            entityClient.entityType,
            entityClient.description,
            entityClient.bankAccount,
            entityClient.contactPerson,
            entityClient.phoneNumber,
            entityClient.email,
            entityClient.isVATRegistered,
            entityClient.status,
            entityClient.dashboardPriority
          )
        );

        if (clientsToBeSaved.length % 100 == 0) {
          await this._db.entityClientRepository.save(clientsToBeSaved);
          clientsToBeSaved = [];
        }
      }

      await this._db.entityClientRepository.save(clientsToBeSaved);
      await this._settings.setProperty((p) => {
        p.isEntityClientFirstTimeSynced = true;
      });
      return true;
    } catch (err) {
      log.error('მყიდველების სინქრონიზაცის შეცდომა', err, err.stack);
      return false;
    }
  }

  async syncEntityTransactions() {
    log.info('იურიდიული გაყიდვების სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'იურიდიული გაყიდვების სინქრონიზაცია');
    try {
      // move transactions to application db
      let posTransactions: EntityTransaction[] = null;
      do {
        posTransactions = await this._transactionDb.entityTransactionRepository
          .createQueryBuilder()
          .take(100)
          .getMany();
        await this._db.entityTransactionRepository.save(posTransactions);
        const posTransactionIds = posTransactions.map((t) => t.id);
        await this._transactionDb.query(`
        DELETE FROM 'entity_transaction' WHERE 'entity_transaction'.'id' in (${posTransactionIds.join(
          ','
        )})
      `);
      } while (posTransactions && posTransactions.length);
      const transactions = await this._db.entityTransactionRepository.find();
      for (const transaction of transactions) {
        try {
          await this._httpAdapter.post(this._httpAdapter.API_ENTITY_SALE, transaction, true);
          await this._db.entityTransactionRepository.delete(transaction.id);
        } catch (err) {
          console.error('entity sale sync error: ', err);
          log.error('იურიდიული გაყიდვის სინქრონიზაციის შეცდომა', err, err.stack);
          return false;
        }
      }

      return true;
    } catch (err) {
      log.error('იურიდიული გაყიდვის სინქრონიზაციის შეცდომა', err, err.stack);
      log.error(err);
      log.error(err.stack);
      return false;
    }
  }

  async syncReceivedOrders() {
    log.info('მიღებული შეკვეთების სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'მიღებული შეკვეთების სინქრონიზაცია');
    try {
      const orders = await this._db.receivedPurchaseOrderRepository.find();
      for (const order of orders) {
        try {
          await this._httpAdapter.put(this._httpAdapter.API_RECEIVE_ORDER, order, true);
          await this._db.receivedPurchaseOrderRepository.delete(order.id);
        } catch (err) {
          log.error('მიღებული შეკვეთების სინქრონიზაცის შეცდომა', err, err.stack);
          return false;
        }
      }

      return true;
    } catch (err) {
      log.error('მიღებული შეკვეთების სინქრონიზაცის შეცდომა', err, err.stack);
      return false;
    }
  }

  async syncStockItems() {
    log.info('პროდუქტების სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'პროდუქტების სინქრონიზაცია');
    try {
      const date = this._settings.data.syncDate.toISOString();
      const result = await this._httpAdapter.get(
        `${this._httpAdapter.API_STOCK_ITEMS}?dateModifiedFrom=${date}`,
        true
      );
      const stockItems = JSON.parse(result) as StockItemDTO[];
      let stockItemsToBeSaved: IStockItem[] = [];

      log.info('გადმოსაწერი პროდუქტების რაოდენობა:', stockItems.length);

      for (const stockItem of stockItems) {
        let photoName = null;
        if (stockItem.photoUrl) {
          photoName = stockItem.photoUrl.replace(/\:\/\//g, '$$$$$$').replace(/\//g, '$$');
        }

        const _stockItem = StockItem.CreateNew(
          stockItem.id,
          stockItem.photoUrl,
          photoName ? `cached-images://${photoName}` : null,
          stockItem.barcode,
          stockItem.name,
          stockItem.quantity,
          stockItem.unitPrice,
          stockItem.status,
          stockItem.unitOfMeasurement,
          stockItem.unitPriceMin,
          stockItem.lowStockThreshold,
          stockItem.dashboardPriority,
          stockItem.categoryId
        );
        stockItemsToBeSaved.push(_stockItem);
        if (stockItemsToBeSaved.length % 100 == 0) {
          await this._db.stockItemRepository.save(stockItemsToBeSaved);
          stockItemsToBeSaved = [];
        }
        if (stockItem.photoUrl) {
          this.savePhotos(`${Constants.UserData}/odinImages/${photoName}`, stockItem.photoUrl);
        }
      }

      await this._db.stockItemRepository.save(stockItemsToBeSaved);
      return true;
    } catch (err) {
      log.error('პროდუქტის სინქრონიზაცის შეცდომა', err, err.stack);
      return false;
    }
  }

  async syncSuppliers() {
    log.info('მომწოდებლების სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'მომწოდებლების სინქრონიზაცია');
    try {
      const date = this._settings.data.syncDate.toISOString();
      const result = await this._httpAdapter.get(
        `${this._httpAdapter.API_SUPPLIERS}?dateModifiedFrom=${date}`,
        true
      );
      const suppliers = JSON.parse(result) as SupplierDTO[];
      let suppliersToBeSaved: ISupplier[] = [];

      for (const supplier of suppliers) {
        suppliersToBeSaved.push(Supplier.CreateNew(supplier.id, supplier.name, supplier.status));

        if (suppliersToBeSaved.length % 100 == 0) {
          await this._db.supplierRepository.save(suppliersToBeSaved);
          suppliersToBeSaved = [];
        }
      }

      await this._db.supplierRepository.save(suppliersToBeSaved);
      return true;
    } catch (err) {
      log.error('მომწოდებლის სინქრონიზაცის შეცდომა', err, err.stack);
      return false;
    }
  }

  async syncSupplierStockItems(isOnBoot = false) {
    log.info('მომწოდებლების საქონლის სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'მომწოდებლების საქონლის სინქრონიზაცია');

    try {
      const date = isOnBoot
        ? new Date(0).toISOString()
        : this._settings.data.syncDate.toISOString();

      const result = await this._httpAdapter.get(
        `${this._httpAdapter.API_SUPPLIRE_STOCK_ITEMS}?dateModifiedFrom=${date}`,
        true
      );

      const supplierStockItemsArray = JSON.parse(result) as SupplierStockItemsDTO[];

      if (isOnBoot) {
        await this._db.query(`DELETE FROM supplier_stock_items_stock_item`);
      }

      for (const supplierStockItems of supplierStockItemsArray) {
        if (!isOnBoot) {
          await this._db.query(
            `DELETE FROM supplier_stock_items_stock_item
             WHERE supplierId  = ?`,
            [supplierStockItems.supplierId]
          );
        }

        if (supplierStockItems.stockItemIds.length > 0) {
          let query = '';

          for (let i = 0; i < supplierStockItems.stockItemIds.length; i++) {
            const stockItem = supplierStockItems.stockItemIds[i];
            if (i % 500 == 0) {
              if (i > 0) {
                await this._db.query(query);
              }
              query = `INSERT INTO supplier_stock_items_stock_item(supplierId,stockItemId) VALUES(${supplierStockItems.supplierId}, ${stockItem})`;
            } else {
              query += `,(${supplierStockItems.supplierId}, ${stockItem})`;
            }
          }

          if (query) {
            await this._db.query(query);
          }
        }
      }
      log.info('done');
      return true;
    } catch (err) {
      log.error('მომწოდებლის საქონლის სინქრონიზაცის შეცდომა', err, err.stack);
      return false;
    }
  }

  async syncPurchaseOrders() {
    log.info('შეკვეთების სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'შეკვეთების სინქრონიზაცია');
    try {
      const date = this._settings.data.syncDate.toISOString();
      const result = await this._httpAdapter.get(
        `${this._httpAdapter.API_PURCHASE_ORDERS}?dateModifiedFrom=${date}`,
        true
      );
      const purchaseOrders = JSON.parse(result) as PurchaseOrderDTO[];
      let purchaseOrdersToBeSaved: PurchaseOrder[] = [];
      let purchaseOrderLinesToBeSaved: PurchaseOrderLine[] = [];
      log.info(`გადმოსაწერი შესყიდვების რაოდენობა: ${purchaseOrders.length}`);

      for (const purchaseOrder of purchaseOrders) {
        purchaseOrdersToBeSaved.push(
          PurchaseOrder.CreateNew(
            purchaseOrder.id,
            purchaseOrder.locationId,
            purchaseOrder.paymentMethod,
            purchaseOrder.name,
            purchaseOrder.orderDate,
            purchaseOrder.expectedReceiveDate,
            purchaseOrder.status,
            purchaseOrder.expectedTotalCost,
            purchaseOrder.receivedTotalCost,
            purchaseOrder.supplierId,
            purchaseOrder.receiveDate,
            purchaseOrder.comment
          )
        );

        for (const orderLine of purchaseOrder.orderLines) {
          purchaseOrderLinesToBeSaved.push(
            PurchaseOrderLine.CreateNew(
              orderLine.id,
              orderLine.orderedQuantity,
              orderLine.expectedUnitCost,
              orderLine.expectedTotalCost,
              orderLine.receivedQuantity,
              orderLine.receivedUnitCost,
              orderLine.receivedTotalCost,
              orderLine.stockItemId,
              purchaseOrder.id
            )
          );
        }
        if (purchaseOrdersToBeSaved.length % 10 == 0) {
          await this._db.purchaseOrderRepository.save(purchaseOrdersToBeSaved);
          purchaseOrdersToBeSaved = [];
          await this._db.purchaseOrderLineRepository.save(purchaseOrderLinesToBeSaved);
          purchaseOrderLinesToBeSaved = [];
        }
      }

      await this._db.purchaseOrderRepository.save(purchaseOrdersToBeSaved);
      await this._db.purchaseOrderLineRepository.save(purchaseOrderLinesToBeSaved);
      return true;
    } catch (err) {
      log.error('გაყიდვების სინქრონიზაცის შეცდომა', err, err.stack);
      return false;
    }
  }

  async syncStockItemCategories() {
    log.info('კატეგორიების სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'კატეგორიების სინქრონიზაცია');
    try {
      const result = await this._httpAdapter.get(this._httpAdapter.API_CATEGORIES, true);
      const categories = JSON.parse(result) as StockItemCategoryCategoryDTO[];

      await this._db.query('PRAGMA foreign_keys = 0;');
      return this._db.transaction(async (transactionalEntityManager) => {
        for (const category of categories) {
          let photoName = null;

          if (category.photoUrl) {
            photoName = category.photoUrl.replace(/\:\/\//g, '$$$$$$').replace(/\//g, '$$');
          }

          if (category.photoUrl) {
            this.savePhotos(`${Constants.UserData}/odinImages/${photoName}`, category.photoUrl);
          }

          const _category = StockItemCategory.CreateNew(
            category.id,
            category.name,
            category.description,
            category.status,
            category.photoUrl,
            photoName ? `cached-images://${photoName}` : null,
            category.parentCategoryId
          );
          await transactionalEntityManager.save(_category);
        }
        await transactionalEntityManager.query('PRAGMA foreign_keys = 1;');
        return true;
      });
    } catch (err) {
      log.error('პროდუქტის კატეგორიის სინქრონიზაცის შეცდომა', err, err.stack);
      await this._db.query('PRAGMA foreign_keys = 1;');
      return false;
    }
  }

  async syncPopularProducts() {
    log.info('პოპულარული პროდუქტების სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'პოპულარული პროდუქტების სინქრონიზაცია');
    const now = new Date(new Date().getTime() - 300000);
    try {
      const result = await this._httpAdapter.get(this._httpAdapter.API_POPULAR_PRODUCTS, true);
      const popularProducts = JSON.parse(result) as PopularProductDTO[];

      for (const popularProduct of popularProducts) {
        const _popularProduct = await this._db.stockItemRepository.findOne({
          where: { id: popularProduct.id },
        });

        if (_popularProduct) {
          await this._db.stockItemRepository.update(
            { id: _popularProduct.id },
            { soldQuantity: popularProduct.quantitySold }
          );
        }
      }
      await this._settings.setProperty((p) => (p.popularSyncDate = now));
      return true;
    } catch (err) {
      log.error('პოპულარული პროდუქტის სინქრონიზაცის შეცდომა', err, err.stack);
      return false;
    }
  }

  async syncImei() {
    log.info('სერიული კოდების სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'სერიული კოდების სინქრონიზაცია');
    const now = new Date(new Date().getTime() - 300000);

    try {
      const date = this._settings.data.imeiSyncDate.toISOString();
      const result = await this._httpAdapter.get(
        `${this._httpAdapter.API_IMEIS}?dateModifiedFrom=${date}`,
        true
      );

      const imeis = JSON.parse(result) as IMEIDTO[];
      let imeisToSave: IMEI[] = [];

      for (const imei of imeis) {
        imeisToSave.push(IMEI.CreateNew(imei.id, imei.imei, imei.status, imei.stockItemId));

        if (imeisToSave.length % 100 == 0) {
          await this._db.imeiRepository.save(imeisToSave);
          imeisToSave = [];
        }
      }

      await this._db.imeiRepository.save(imeisToSave);

      this._settings.setProperty((p) => (p.imeiSyncDate = now));
      return true;
    } catch (err) {
      log.error('სერიული კოდების სინქრონიზაციის შეცდომა', err, err.stack);
      return false;
    }
  }

  async syncLegalEntityData() {
    log.info('მონაცემების სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'მონაცემების სინქრონიზაცია');
    try {
      const result = await this._httpAdapter.get(`${this._httpAdapter.API_USER_DETAILS}`, true);
      const userData = JSON.parse(result) as UserDetailsDTO;
      await this._settings.setProperty((x) => {
        x.taxRate = userData.taxRate;
      });

      return true;
    } catch (err) {
      log.error('მონაცემების სინქრონიზაციის დროს დაფიქსირდა შეცდომა', err, err.stack);
      return false;
    }
  }

  async syncOperators(force?: boolean) {
    log.info('თანამშრომლების სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'თანამშრომლების სინქრონიზაცია');
    try {
      const date = force ? new Date(0).toISOString() : this._settings.data.syncDate.toISOString();
      const url = `${this._httpAdapter.API_OPERATORS}?dateModifiedFrom=${date}`;
      const result = await this._httpAdapter.get(url, true);
      const operators = JSON.parse(result) as OperatorDTO[];

      log.info('გადმოსაწერი თანამშრომლების რაოდენობა:', operators.length);

      for (const operator of operators) {
        await this._db.operatorRepository.save(
          Operator.CreateNew(
            operator.id,
            operator.name,
            operator.pinCode,
            operator.status,
            operator.permissions
          )
        );
      }

      return true;
    } catch (error) {
      log.error('თანამშრომლების სინქრონიზაცის შეცდომა', error, error.stack);
      return false;
    }
  }

  async syncOperatorSessionActions() {
    log.info('თანამშრომლების ავტორიზაციის სინქრონიზაცია');
    try {
      const loginActions = await this._db.operatorSessionActionRepository.find({
        where: { actionType: OperatorSessionActionType.Login },
      });
      const logoutActions = await this._db.operatorSessionActionRepository.find({
        where: { actionType: OperatorSessionActionType.Logout },
      });

      for (const loginAction of loginActions) {
        try {
          await this._httpAdapter.post(this._httpAdapter.API_OPERATOR_LOGIN, loginAction, true);
          await this._db.operatorSessionActionRepository.delete(loginAction.id);
        } catch (err) {
          log.error('თანამშრომლების ავტორიზაციის სინქრონიზაცის შეცდომა', err, err.stack);
          return false;
        }
      }

      for (const logoutAction of logoutActions) {
        try {
          await this._httpAdapter.post(this._httpAdapter.API_OPERATOR_LOGOUT, logoutAction, true);
          await this._db.operatorSessionActionRepository.delete(logoutAction.id);
        } catch (err) {
          log.error('თანამშრომლების ავტორიზაციის სინქრონიზაცის შეცდომა', err, err.stack);
          return false;
        }
      }

      return true;
    } catch (err) {
      log.error('თანამშრომლების ავტორიზაციის სინქრონიზაცის შეცდომა', err, err.stack);
      return false;
    }
  }

  async syncShifts() {
    log.info('ცვლების სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'ცვლების სინქრონიზაცია');
    try {
      const shifts = await this._db.shiftRepository.find({ finished: true });
      for (const shift of shifts) {
        try {
          await this._httpAdapter.post(this._httpAdapter.API_SHIFT, shift, true);
          await this._db.shiftRepository.delete(shift.id);
        } catch (err) {
          log.error('ცვლის სინქრონიზაცის შეცდომა', err, err.stack);
          return false;
        }
      }

      return true;
    } catch (err) {
      log.error('ცვლის სინქრონიზაცის შეცდომა', err, err.stack);
      return false;
    }
  }

  async syncShiftActions() {
    log.info('ცვლების ქმედებების სინქრონიზაცია');
    try {
      const startActions = await this._db.shiftActionRepository.find({
        where: { actionType: ShiftActionType.Start },
      });
      const endActions = await this._db.shiftActionRepository.find({
        where: { actionType: ShiftActionType.End },
      });

      for (const startAction of startActions) {
        try {
          await this._httpAdapter.post(this._httpAdapter.API_SHIFT_START, startAction, true);
          await this._db.shiftActionRepository.delete(startAction.id);
        } catch (err) {
          log.error('ცვლების ქმედებების სინქრონიზაცის შეცდომა', err, err.stack);
          return false;
        }
      }

      for (const endAction of endActions) {
        try {
          await this._httpAdapter.post(this._httpAdapter.API_SHIFT_END, endAction, true);
          await this._db.shiftActionRepository.delete(endAction.id);
        } catch (err) {
          log.error('ცვლების ქმედებების სინქრონიზაცის შეცდომა', err, err.stack);
          return false;
        }
      }

      return true;
    } catch (err) {
      log.error('ცვლების ქმედებების სინქრონიზაცის შეცდომა', err, err.stack);
      return false;
    }
  }

  async syncCashWithdrawals() {
    log.info('გაცემული თანხების სინქრონიზაცია');
    try {
      const withdrawals = await this._db.cashWithdrawalRepository.find();
      for (let i = 0; i < withdrawals.length; i++) {
        const withdrawal = withdrawals[i];
        try {
          await this._httpAdapter.post(this._httpAdapter.API_CASH_WITHDRAWAL, withdrawal, true);
          await this._db.cashWithdrawalRepository.delete(withdrawal.id);
        } catch (err) {
          log.error('გაცემული თანხების სინქრონიზაცის შეცდომა', err, err.stack);
          return false;
        }
      }

      return true;
    } catch (err) {
      log.error('გაცემული თანხების სინქრონიზაცის შეცდომა', err, err.stack);
      return false;
    }
  }

  private async savePhotos(path: string, url: string) {
    try {
      return await new Promise((resolve, reject) => {
        if (!fs.existsSync(path)) {
          request.head(url, function (err, res, body) {
            request(url)
              .pipe(fs.createWriteStream(path))
              .on('close', () => resolve());
          });
        } else {
          resolve();
        }
      });
    } catch (err) {
      log.error('სურათების გადმოწერისას დაფიქსირდა შეცდომა', err, err.stack);
    }
  }

  async syncSpaces() {
    log.info('სივრცეების სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'სივრცეების სინქრონიზაცია');
    try {
      const date = this._settings.data.syncDate.toISOString();
      const result = await this._httpAdapter.get(
        `${this._httpAdapter.API_SPACES}?dateModifiedFrom=${date}`,
        true
      );
      const spaces = JSON.parse(result) as SpaceDTO[];
      log.info('გადმოწერილი სივრცეების რაოდენობა: ', spaces.length);
      log.info('გადმოწერილი სივრცეები: ', spaces);
      await this._db.spaceRepository.save(spaces);

      for (const space of spaces) {
        if (space.tables) {
          for (const table of space.tables) {
            await this._db.tableRepository.save({ ...table, space: space });
          }
        }
      }
      return true;
    } catch (err) {
      log.error('სივრცეების გადმოწერის დროს დაფიქსირდა შეცდომა', err, err.stack);
      return false;
    }
  }

  async syncLocationAddress() {
    log.info('მისამართის სინქრონიზაცია');
    this._eventService.sendEvent(OdinEvent.BOOT, 'მისამართის სინქრონიზაცია');
    try {
      const result = await this._httpAdapter.get(
        `${this._httpAdapter.API_LOCATIONS}/${this._settings.data.locationId}`,
        true
      );
      const location = JSON.parse(result) as LocationDTO;
      await this._settings.setProperty((x) => {
        x.locationData = {
          name: location.name,
          address: location.address,
          managerName: location.managerName,
          phoneNumber: location.phoneNumber,
        };
      });

      return true;
    } catch (err) {
      log.error('მისამართის სინქრონიზაცის დროს დაფიქსირდა შეცდომა', err, err.stack);
      return false;
    }
  }
}
