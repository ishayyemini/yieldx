import Dexie, { Table } from 'dexie'

import { ID } from './uuid'

export interface Warehouse {
  UID: ID
  Type: number
  Name: string
  // Description: string
  MaxCapacity: number
  // ActualInventory: number
  Status: number
  // WHRows: number
  // WHCols: number
  // lat_Y: number
  // long_X: number
  // UserID: string
  DateCreate: string
  DateModified: string
  // SystemLock: boolean
  // Deleted: boolean
  // Width?: number
  // WHLength?: number
  // Density?: number
  // Alert?: boolean
  // IsMulti?: boolean
  // PlannedInventory?: number
  // LocX?: number
  // LocY?: number
  // IsBioCore?: boolean
  // LayoutImage?: string
  // IsLoadingPoint?: boolean
}

export interface WHOwnerChild {
  OwnerID: ID
  ChildID: ID
  // UserID: string
  DateCreate: string
  DateModified: string
  // SystemLock?: boolean
  // Deleted?: boolean
}

export interface WHSingleProdAmount {
  WHID: ID
  ProdID: ID
  Amount: number
  // PlannedAmount: number
  // UserID: string
  DateCreate: string
  DateModified: string
  // SystemLock?: boolean
  // Deleted?: boolean
  // NfcID?: ID
  // InDate?: string
  // OccupationTime?: number
}

export interface Product {
  UID: ID
  Name: string
  FlockID: ID
  FlockWHID: ID
  LayingDate: string
  Type: number
  // UserID: string
  DateCreate: string
  DateModified: string
  // SystemLock: boolean
  // Deleted: boolean
  // HatchingForecast: number
  // ActualHatching: number
  InitAmount: number
  // PlanningState: number
  // FertileSTD?: number
  // FertileAct?: number
  DailyReportID?: ID
  TrolleyUID?: ID
  ParentProduct?: ID
}

export interface EZTransaction {
  UID: ID
  CreateDate: string
  SourceWH: ID
  DestinationWH: ID
  Amount: number
  // Status: number
  // ExecutionDate?: string
  DueDate?: string
  Product: ID
  // BatchID?: ID
  // ShipCert: ID
  // UserID: string
  DateCreate: string
  DateModified: string
  // TrolieType: ID
  // Deleted: boolean
  // SystemLock: boolean
  // Type?: ID
  // OrderID?: ID
  // Position?: number
  // Program?: number
}

interface WarehouseSingleType {
  TypeID: number
  TypeDescription: string
  // UserID: string
  DateCreate: string
  DateModified: string
  // SystemLock: boolean
  // Deleted: boolean
  // AllowedDest?: number
  Color?: number
}

export class MySubClassedDexie extends Dexie {
  Warehouses!: Table<Warehouse>
  WHOwnerChilds!: Table<WHOwnerChild>
  WHProdAmount!: Table<WHSingleProdAmount>
  Products!: Table<Product>
  EZTransactions!: Table<EZTransaction>
  WarehouseType!: Table<WarehouseSingleType>

  constructor() {
    super('myDatabase')
    this.version(2).stores({
      Warehouses: 'UID, Type',
      WHOwnerChilds: '[OwnerID+ChildID]',
      WHProdAmount: '[WHID+ProdID], Amount',
      Products: 'UID, &FlockID, &FlockWHID, &DailyReportID',
      EZTransactions: 'UID, &SourceWH,  &DestinationWH, DueDate, &Product',
      WarehouseType: 'TypeID',
    })
  }

  loadInitialData() {}
}

export const db = new MySubClassedDexie()
