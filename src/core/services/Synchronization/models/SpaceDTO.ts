export interface SpaceDTO {
  locationId: number;
  id: number;
  name: string;
  status: number;
  tables: TableDTO[];
}

export interface TableDTO {
  id: number;
  name: string;
  status: number;
  arrangement: TableArrangementDTO;
}

export interface TableArrangementDTO {
  left: number;
  top: number;
  width: number;
  height: number;
  boxType: number;
}
