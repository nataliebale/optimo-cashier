export interface StockItemCategoryCategoryDTO {
  id: number;
  name: string;
  description: string;
  status: number;
  photoUrl?: string;
  parentCategoryId?: number;
}
