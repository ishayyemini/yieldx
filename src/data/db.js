import Dexie from 'dexie'

import { v4 as uuid } from 'uuid'

export class MySubClassedDexie extends Dexie {
  constructor() {
    super('myDatabase')
    this.version(4).stores({
      Warehouses: 'UID, Type, Name',
      WHOwnerChilds: '[OwnerID+ChildID]',
      WHProdAmount: '[WHID+ProdID], Amount',
      Products: 'UID, &FlockID, &FlockWHID, &DailyReportID',
      Flocks: 'UID, Name, HatchDate, Size',
      FlocksWarehouse: '[FlockID+WHID]',
      EZTransactions: 'UID, &SourceWH,  &DestinationWH, DueDate, &Product',
      WarehouseType: 'TypeID',
    })
  }

  async loadInitialData() {
    const ST_AMOUNT = 12
    const HR_AMOUNT = 4
    const now = new Date().toISOString().replace(/[TZ]/g, ' ')
    const halfYear = new Date(new Date().getTime() - 1000 * 3600 * 24 * 180)
      .toISOString()
      .replace(/[TZ]/g, ' ')

    const initWT = async () => {
      const initData = [
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
      const dataInDB = await this.WarehouseType.toArray()
      const changed = !initData.every((type) =>
        dataInDB.find(
          (typeInDB) =>
            typeInDB.TypeID === type.TypeID &&
            typeInDB.TypeDescription === type.TypeDescription
        )
      )
      if (changed) await this.WarehouseType.bulkPut(initData)
    }
    const initWarehouses = async () => {
      const initData = [
        // Parent Stock
        { UID: PS, Type: 1, Name: 'PS1', MaxCapacity: 0 },
        { UID: PS_H, Type: 7, Name: 'PS1_H1', MaxCapacity: 0 }, // House
        { UID: PS_ES, Type: 2, Name: 'PS1_ES1', MaxCapacity: 0 }, // EggStorage
        { UID: PS_LR, Type: 12, Name: 'PS1_LR1', MaxCapacity: 1000000 }, // LoadingRamp

        // Hatchery
        { UID: HT, Type: 4, Name: 'HT1', MaxCapacity: 0 },
        { UID: HT_ES, Type: 2, Name: 'HT1_ES1', MaxCapacity: 1000000 }, // EggStorage
        ...Array.from({ length: ST_AMOUNT }, (_, i) => ({
          UID: HT_ST[i],
          Type: 3,
          Name: `HT1_ST${i}`,
          MaxCapacity: 57600,
        })), // Setter
        ...Array.from({ length: HR_AMOUNT }, (_, i) => ({
          UID: HT_HR[i],
          Type: 8,
          Name: `HT1_HR${i}`,
          MaxCapacity: 28800,
        })), // HatchRoom
        { UID: HT_CH, Type: 5, Name: 'HT1_CH1', MaxCapacity: 1000000 }, // ChickHall
        { UID: HT_TR, Type: 18, Name: 'HT1_TR1', MaxCapacity: 100000 }, // Truck

        // BRFarm
        { UID: BR, Type: 13, Name: 'BR1', MaxCapacity: 0 },
        { UID: BR_H, Type: 7, Name: 'BR1_H1', MaxCapacity: 0 }, // House

        // SlaughterHouse
        { UID: SL, Type: 16, Name: 'SL1', MaxCapacity: 0 },
        { UID: SL_LR, Type: 12, Name: 'SL1_LR1', MaxCapacity: 1000000 }, // LoadingRamp
      ].map((wh) => ({
        ...wh,
        DateCreate: now,
        DateModified: now,
        Status: 1,
      }))

      const dataInDB = await this.Warehouses.toArray()
      const changed = !initData.every((wh) =>
        dataInDB.find(
          (whInDB) =>
            whInDB.UID === wh.UID &&
            whInDB.Name === wh.Name &&
            whInDB.Type === wh.Type &&
            whInDB.MaxCapacity === wh.MaxCapacity
        )
      )
      if (changed) {
        this.Warehouses.clear()
        this.WHProdAmount.clear()
        this.EZTransactions.clear()
        this.Warehouses.bulkPut(initData)
      }
    }
    const initWHC = async () => {
      const initData = [
        { OwnerID: PS, ChildID: PS_ES },
        { OwnerID: PS, ChildID: PS_H },
        { OwnerID: PS, ChildID: PS_LR },

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

      const dataInDB = await this.WHOwnerChilds.toArray()
      const changed = !initData.every((whc) =>
        dataInDB.find(
          (whcInDB) =>
            whcInDB.OwnerID === whc.OwnerID && whcInDB.ChildID === whc.ChildID
        )
      )
      if (changed) {
        this.WHOwnerChilds.clear()
        this.WHOwnerChilds.bulkPut(initData)
      }
    }
    const initFL = async () => {
      const initFlocks = [
        {
          UID: FL,
          Name: 'PS1_FL1',
          Size: 15100,
          HatchDate: halfYear,
          DateCreate: now,
          DateModified: now,
        },
      ]
      const initFlocksWarehouse = [
        { FlockID: FL, WHID: PS_H, DateCreate: now, DateModified: now },
      ]

      if (!(await this.Flocks.get(FL))) {
        this.Flocks.clear()
        this.FlocksWarehouse.clear()
        this.Flocks.bulkPut(initFlocks)
        this.FlocksWarehouse.bulkPut(initFlocksWarehouse)
      }
    }
    const getUIDs = async () => {
      const whList = await this.Warehouses.toArray()
      const whcList = await this.WHOwnerChilds.toArray()

      const getChildrenUID = (owner, type) =>
        whcList
          .filter(
            (whc) =>
              whc.OwnerID === owner &&
              whList.find((wh) => wh.Type === type && wh.UID === whc.ChildID)
          )
          .map((whc) => whc.ChildID)

      const PS = whList.find((wh) => wh.Type === 1)?.UID ?? uuid()
      const PS_ES = getChildrenUID(PS, 2)[0] ?? uuid()
      const PS_H = getChildrenUID(PS, 7)[0] ?? uuid()
      const PS_LR = getChildrenUID(PS, 12)[0] ?? uuid()

      const BR = whList.find((wh) => wh.Type === 13)?.UID ?? uuid()
      const BR_H = getChildrenUID(BR, 7)[0] ?? uuid()

      const HT = whList.find((wh) => wh.Type === 4)?.UID ?? uuid()
      const HT_CH = getChildrenUID(HT, 5)[0] ?? uuid()
      const HT_ES = getChildrenUID(HT, 2)[0] ?? uuid()
      let HT_HR = getChildrenUID(HT, 8)
      if (HT_HR.length !== HR_AMOUNT)
        HT_HR = Array.from({ length: HR_AMOUNT }, () => uuid())
      let HT_ST = getChildrenUID(HT, 3)
      if (HT_ST.length !== ST_AMOUNT)
        HT_ST = Array.from({ length: ST_AMOUNT }, () => uuid())
      const HT_TR = getChildrenUID(HT, 18)[0] ?? uuid()

      const SL = whList.find((wh) => wh.Type === 16)?.UID ?? uuid()
      const SL_LR = getChildrenUID(SL, 12)[0] ?? uuid()

      const FL =
        (await this.FlocksWarehouse.toArray().then((flw) => flw?.[0]?.WHID)) ??
        uuid()

      return {
        PS,
        PS_ES,
        PS_H,
        PS_LR,
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
        FL,
      }
    }

    const {
      PS,
      PS_ES,
      PS_H,
      PS_LR,
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
      FL,
    } = await getUIDs()

    await initWT()
    await initWarehouses()
    await initWHC()
    await initFL()
  }

  async birthEggs() {
    const ES_ID = await this.Warehouses.get({ Name: 'PS1_ES1' }).then(
      (wh) => wh?.UID
    )
    const H_ID = await this.Warehouses.get({ Name: 'PS1_H1' }).then(
      (wh) => wh?.UID
    )
    const FlockID = await this.Flocks.get({ Name: 'PS1_FL1' }).then(
      (fl) => fl?.UID
    )
    const ProdID = uuid()
    const now = new Date().toISOString().replace(/[TZ]/g, ' ')
    const Name = `PS1_H1_${Date.now()}`

    if (ES_ID && H_ID && FlockID) {
      await this.Products.put({
        UID: ProdID,
        Name,
        FlockID,
        FlockWHID: H_ID,
        LayingDate: now,
        InitAmount: 2400,
        DateCreate: now,
        DateModified: now,
      })
      await this.WHProdAmount.put({
        WHID: H_ID,
        ProdID,
        Amount: 2400,
        DateCreate: now,
        DateModified: now,
      })
    } else console.error('Missing some warehouses!')
  }
}

export const db = new MySubClassedDexie()
