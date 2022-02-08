import { Not, Like } from 'typeorm';
import { IResult } from '../../shared/types/IResult';
import { IStockItem } from '../../shared/types/IStockItem';
import { ApplicationDb } from '../infrastructure/ApplicationDb';
import { IMEI, StockItem, StockItemCategory } from '../infrastructure/Entities';

export class StockItemQueries {
  constructor(private readonly _db: ApplicationDb) {}

  async getCategories(
    pageIndex: number,
    pageSize: number,
    name: string,
    parentId?: number,
    all = false
  ): Promise<StockItemCategory[]> {
    let query;

    if (!name) {
      name = '';
    }

    if (all) {
      query = {
        where: {
          status: 1,
        },
      };
    } else {
      if (!parentId) {
        parentId = null;
      }

      query = {
        relations: ['childCategories'],
        where: {
          status: 1,
          parentCategory: parentId,
          name: Like(`%${name}%`),
        },
        order: { name: 'ASC' },
        skip: pageIndex * pageSize,
        take: pageSize,
      };
    }

    return await this._db.stockItemCategoryRepository.find(query);
  }

  async countCategories(name: string, parentId?: number, all = false): Promise<number> {
    let query;

    if (!name) {
      name = '';
    }

    if (all) {
      query = {
        where: {
          status: 1,
          name: Like(`%${name}$`),
        },
      };
    } else {
      if (!parentId) {
        parentId = null;
      }

      query = {
        relations: ['childCategories'],
        where: {
          status: 1,
          name: Like(`%${name}%`),
          parentCategory: parentId,
        },
      };
    }

    return await this._db.stockItemCategoryRepository.count(query);
  }

  async getIMEISByStockItem(id: number): Promise<IResult<IMEI[]>> {
    const stockItem = (await this._db.stockItemRepository.query(`
    SELECT *
      FROM 'imei' 'i'
     WHERE 'i'.'stockItemId' = ${id}
       AND 'i'.'status' == 0
       `)) as IMEI[];

    return { data: stockItem };
  }

  async getProducts(
    keyWord: string,
    pageIndex: number,
    pageSize: number,
    category?: number,
    topSold = false,
    supplier?: number,
    forDashboard = false
  ): Promise<IStockItem[]> {
    let whereQuery = '';
    const orderQuery = [];

    keyWord = keyWord.replace(/'/g, "''");

    whereQuery += ` AND (
      'stockItem'.'barcode' LIKE '%${keyWord}%'
      OR 'stockItem'.'name' LIKE '%${keyWord}%'
      OR 'imei'.'imei' LIKE '%${keyWord}%'
    ) AND 'stockItem'.'status' = 1`;

    if (forDashboard) {
      orderQuery.push(`case when dashboardpriority is null then 1 else 0 end`);
      orderQuery.push(`dashboardpriority`);
    }

    if (category) {
      whereQuery += ` AND 'stockItem'.'categoryId' = ${category}`;
    }

    if (supplier) {
      whereQuery += ` AND 'stockItem'.'Id' IN (
                SELECT 'supplier_stockItem'.'stockItemId'
                  FROM 'supplier_stock_items_stock_item' 'supplier_stockItem'
                 WHERE 'supplier_stockItem'.'supplierId' = ${supplier}
            )`;
    }

    if (topSold) {
      orderQuery.push(`'stockItem'.'soldQuantity' DESC`);
    } else {
      orderQuery.push(`'stockItem'.'name' ASC`);
    }

    return (await this._db.stockItemRepository.query(`
SELECT     'stockItem'.'id',
           'stockItem'.'photoUrl' ${process.env.APP_TYPE !== 'electron' ? `'photoPath'` : ''},
           'stockItem'.'photoPath' ${process.env.APP_TYPE !== 'electron' ? `'photoUrl'` : ''},
           'stockItem'.'barcode',
           'stockItem'.'name',
           'stockItem'.'quantity',
           'stockItem'.'unitPrice',
           'stockItem'.'soldQuantity',
           'stockItem'.'unitOfMeasurement',
           'stockItem'.'unitPriceMin',
           'stockItem'.'lowStockThreshold',
           'imei'.'imei',
           case when EXISTS (
             SELECT 1 FROM 'imei' where  stockItemId = 'stockItem'.'id' and status = 0
            ) then true else false end hasImei,
           case when 'itemReceipt'.'stockItemId' IS NULL then false else true end isReceipt
FROM       'stock_item' 'stockItem'
LEFT JOIN (SELECT 'i'.'imei', 'i'.'stockItemId'
             FROM 'imei' 'i'
			       LEFT JOIN 'stock_item' 'si'
               ON 'i'.'stockItemId' = 'si'.'id'
            WHERE 'i'.'imei' LIKE '%${keyWord}%'
              AND 'si'.'status' = 1
              AND 'i'.'status' = 0 LIMIT 1) 'imei'
ON     'stockItem'.'id' = 'imei'.'stockItemId'
LEFT JOIN (SELECT 'sup'.'stockItemId' FROM 'supplier_stock_items_stock_item' 'sup' WHERE 'sup'.'supplierId' = -1) 'itemReceipt'
ON     'stockItem'.'id' = 'itemReceipt'.'stockItemId'
WHERE  1 = 1 ${whereQuery}
ORDER  BY ${orderQuery.join(', ')}
LIMIT  ${pageIndex * pageSize}, ${pageSize}
        `)) as IStockItem[];
  }
  async countProducts(
    keyWord: string,
    category?: number,
    supplier?: number,
    forDashboard = false
  ): Promise<number> {
    let whereQuery = '';
    const orderQuery = [];

    keyWord = keyWord.replace(/'/g, "''");

    whereQuery += ` AND (
      'stockItem'.'barcode' LIKE '%${keyWord}%'
      OR 'stockItem'.'name' LIKE '%${keyWord}%'
      OR 'imei'.'imei' LIKE '%${keyWord}%'
    ) AND 'stockItem'.'status' = 1`;

    if (forDashboard) {
      orderQuery.push(`case when dashboardpriority is null then 1 else 0 end`);
      orderQuery.push(`dashboardpriority`);
    }

    if (category) {
      whereQuery += ` AND 'stockItem'.'categoryId' = ${category}`;
    }

    if (supplier) {
      whereQuery += ` AND 'stockItem'.'Id' IN (
                SELECT 'supplier_stockItem'.'stockItemId'
                  FROM 'supplier_stock_items_stock_item' 'supplier_stockItem'
                 WHERE 'supplier_stockItem'.'supplierId' = ${supplier}
            )`;
    }

    return (
      await this._db.stockItemRepository.query(`
        SELECT     COUNT('stockItem'.'id') as cnt,
                   'stockItem'.'photoUrl',
                   'stockItem'.'photoPath',
                   'stockItem'.'barcode',
                   'stockItem'.'name',
                   'stockItem'.'quantity',
                   'stockItem'.'unitPrice',
                   'stockItem'.'soldQuantity'
        FROM       'stock_item' 'stockItem'
        LEFT JOIN (SELECT 'i'.'imei', 'i'.'stockItemId'
                     FROM 'imei' 'i'
                     LEFT JOIN 'stock_item' 'si'
                       ON 'i'.'stockItemId' = 'si'.'id'
                    WHERE 'i'.'imei' LIKE '%${keyWord}%'
                      AND 'si'.'status' = 1
                      AND 'i'.'status' = 0 LIMIT 1) 'imei'
        WHERE  1 = 1 ${whereQuery}`)
    )[0].cnt;
  }

  async getProductByBarcode(barcode: string): Promise<IStockItem[]> {
    barcode = barcode.replace(/'/g, "''");
    const query = `
      SELECT
        'si'.*, 'imei'.'imei', case when EXISTS (SELECT 1 FROM 'imei' where  stockItemId = 'si'.'id') then true else false end hasImei,
        CASE WHEN EXISTS (SELECT 1 FROM 'supplier_stock_items_stock_item' 'ssisi' WHERE 'ssisi'.'stockItemId' = 'si'.'id') THEN true ELSE false END AS isReceipt
      FROM 'stock_item' 'si'
      LEFT JOIN (SELECT 'i'.'imei', 'i'.'stockItemId'
                   FROM 'imei' 'i'
                  WHERE 'i'.'imei' = '${barcode}'
                    AND 'i'.'status' = 0) 'imei'
        ON 'si'.'id' = 'imei'.'stockItemId'
      WHERE ('si'.'barcode' = '${barcode}' OR 'imei'.'imei' = '${barcode}')
        AND 'si'.'status' = 1
    `;
    // console.log('dev => getProductByBarcode query =>', query);
    return (await this._db.stockItemRepository.query(query)) as IStockItem[];
  }
}
