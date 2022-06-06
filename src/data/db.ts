import Dexie, { Table } from 'dexie'

import { ID, uuid } from './uuid'

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

export interface WHProdAmount {
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

export interface WarehouseType {
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
  WHProdAmount!: Table<WHProdAmount>
  Products!: Table<Product>
  EZTransactions!: Table<EZTransaction>
  WarehouseType!: Table<WarehouseType>

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

  async loadInitialData() {
    const ST_AMOUNT = 12
    const HR_AMOUNT = 4
    const now = new Date().toISOString().replace(/[TZ]/g, ' ')

    const initWT = async () => {
      const initTypes: Array<WarehouseType> = [
        'Unknown',
        'PSFarm',
        'EggStorage',
        'Setter',
        'Hatchery',
        'ChickHall',
        'PreHeat',
        'House',
        'HatchRoom',
        'Grabage',
        'Restore',
        'Transfer Room',
        'Loading Ramp',
        'BRFarm',
        'Customer',
        'Supplier',
        'Slaughterhouse',
        'Hallway',
        'Truck',
        'Area',
      ].map((type, index) => ({
        TypeID: index,
        TypeDescription: type,
        DateCreate: now,
        DateModified: now,
      }))
      const dataInDB = await db.WarehouseType.toArray()
      const changed = !initTypes.every((type) =>
        dataInDB.find(
          (typeInDB) =>
            typeInDB.TypeID === type.TypeID &&
            typeInDB.TypeDescription === type.TypeDescription
        )
      )
      if (changed) await db.WarehouseType.bulkPut(initTypes)
    }
    const initWarehouses = async () => {
      const initTypes: Array<Warehouse> = [
        // Parent Stock
        { UID: PS, Type: 1, Name: 'PS1', MaxCapacity: 0 },
        { UID: PS_ES, Type: 2, Name: 'PS1_ES1', MaxCapacity: 0 }, // EggStorage
        { UID: PS_H, Type: 7, Name: 'PS1_H1', MaxCapacity: 0 }, // House

        // BRFarm
        { UID: BR, Type: 13, Name: 'BR1', MaxCapacity: 0 },
        { UID: BR_H, Type: 7, Name: 'BR1_H1', MaxCapacity: 0 }, // House

        // Hatchery
        { UID: HT, Type: 4, Name: 'HT1', MaxCapacity: 0 },
        { UID: HT_CH, Type: 5, Name: 'HT1_CH1', MaxCapacity: 1000000 }, // ChickHall
        { UID: HT_ES, Type: 2, Name: 'HT1_ES1', MaxCapacity: 1000000 }, // EggStorage
        ...Array.from({ length: HR_AMOUNT }, (_, i) => ({
          UID: HT_HR[i],
          Type: 8,
          Name: `HT1_HR${i}`,
          MaxCapacity: 28800,
        })), // HatchRoom
        ...Array.from({ length: ST_AMOUNT }, (_, i) => ({
          UID: HT_ST[i],
          Type: 3,
          Name: `HT1_ST${i}`,
          MaxCapacity: 57600,
        })), // Setter
        { UID: HT_TR, Type: 18, Name: 'HT1_TR1', MaxCapacity: 100000 }, // Truck

        // SlaughterHouse
        { UID: SL, Type: 16, Name: 'SL1', MaxCapacity: 0 },
        { UID: SL_LR, Type: 12, Name: 'SL1_LR1', MaxCapacity: 1000000 }, // LoadingRamp
      ].map((wh) => ({
        ...wh,
        DateCreate: now,
        DateModified: now,
        Status: 1,
      }))

      const dataInDB = await db.Warehouses.toArray()
      const changed = !initTypes.every((wh) =>
        dataInDB.find(
          (whInDB) =>
            whInDB.UID === wh.UID &&
            whInDB.Name === wh.Name &&
            whInDB.Type === wh.Type &&
            whInDB.MaxCapacity === wh.MaxCapacity
        )
      )
      if (changed) {
        db.Warehouses.clear()
        db.Warehouses.bulkPut(initTypes)
      }
    }
    const initWHC = async () => {
      const initTypes: Array<WHOwnerChild> = [
        { OwnerID: PS, ChildID: PS_ES },
        { OwnerID: PS, ChildID: PS_H },

        { OwnerID: BR, ChildID: BR_H },

        { OwnerID: HT, ChildID: HT_CH },
        { OwnerID: HT, ChildID: HT_ES },
        ...Array.from({ length: HR_AMOUNT }, (_, i) => ({
          OwnerID: HT,
          ChildID: HT_HR[i],
        })),
        ...Array.from({ length: ST_AMOUNT }, (_, i) => ({
          OwnerID: HT,
          ChildID: HT_ST[i],
        })),
        { OwnerID: HT, ChildID: HT_TR },

        { OwnerID: SL, ChildID: SL_LR },
      ].map((whc) => ({
        ...whc,
        DateCreate: now,
        DateModified: now,
      }))

      const dataInDB = await db.WHOwnerChilds.toArray()
      const changed = !initTypes.every((whc) =>
        dataInDB.find(
          (whcInDB) =>
            whcInDB.OwnerID === whc.OwnerID && whcInDB.ChildID === whc.ChildID
        )
      )
      if (changed) {
        db.WHOwnerChilds.clear()
        db.WHOwnerChilds.bulkPut(initTypes)
      }
    }
    const getUIDs = async () => {
      const whList = await db.Warehouses.toArray()
      const whcList = await db.WHOwnerChilds.toArray()

      const getChildrenUID = (owner: ID, type: number): Array<ID> =>
        whcList
          .filter(
            (whc) =>
              whc.OwnerID === owner &&
              whList.find((wh) => wh.Type == type && wh.UID == whc.ChildID)
          )
          .map((whc) => whc.ChildID)

      const PS = whList.find((wh) => wh.Type == 1)?.UID ?? uuid()
      const PS_ES = getChildrenUID(PS, 2)[0] ?? uuid()
      const PS_H = getChildrenUID(PS, 7)[0] ?? uuid()

      const BR = whList.find((wh) => wh.Type == 13)?.UID ?? uuid()
      const BR_H = getChildrenUID(BR, 7)[0] ?? uuid()

      const HT = whList.find((wh) => wh.Type == 4)?.UID ?? uuid()
      const HT_CH = getChildrenUID(HT, 5)[0] ?? uuid()
      const HT_ES = getChildrenUID(HT, 2)[0] ?? uuid()
      let HT_HR = getChildrenUID(HT, 8)
      if (HT_HR.length != HR_AMOUNT)
        HT_HR = Array.from({ length: HR_AMOUNT }, () => uuid())
      let HT_ST = getChildrenUID(HT, 3)
      if (HT_ST.length != ST_AMOUNT)
        HT_ST = Array.from({ length: ST_AMOUNT }, () => uuid())
      const HT_TR = getChildrenUID(HT, 18)[0] ?? uuid()

      const SL = whList.find((wh) => wh.Type == 16)?.UID ?? uuid()
      const SL_LR = getChildrenUID(SL, 12)[0] ?? uuid()

      return {
        PS,
        PS_ES,
        PS_H,
        BR,
        BR_H,
        HT,
        HT_CH,
        HT_ES,
        HT_HR,
        HT_ST,
        HT_TR,
        SL,
        SL_LR,
      }
    }

    const {
      PS,
      PS_ES,
      PS_H,
      BR,
      BR_H,
      HT,
      HT_CH,
      HT_ES,
      HT_HR,
      HT_ST,
      HT_TR,
      SL,
      SL_LR,
    } = await getUIDs()

    await initWT()
    await initWarehouses()
    await initWHC()
  }
}

export const db = new MySubClassedDexie()
