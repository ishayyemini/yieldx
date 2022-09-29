const sql = require('mssql')

const get_wh_amounts = async ({ db, lastFetched }) => {
  if (!db) throw Error('Missing DB')

  console.log(
    `Getting a list of Warehouses in ${db} ${
      lastFetched ? `modified after ${lastFetched}` : ''
    }`
  )

  const config = {
    user: 'sa',
    password: 'Yieldxbiz2021',
    server: '3.127.195.30',
    database: db,
    options: { encrypt: false },
  }
  await sql.connect(config).catch((e) => console.log(e))

  const warehouses = await new sql.Request()
    .query(
      `
  SELECT Warehouses.UID as UID, Warehouses.Name as Name, 
         WarehouseType.TypeDescription as Type,
         isnull(sum(WHProdAmount.Amount), 0) as AmountTotal,
         isnull(sum(CASE WHEN CONVERT(DATE, DailyReports.ReportDate) = 
                                CONVERT(DATE, getdate())
                         THEN DailyReports.TotalProdEgg
                    END), 0) as AmountToday,
         max(WHProdAmount.DateModified) as DateModified,
         ParentWH.Name as OwnerName, ParentType.TypeDescription as OwnerType
  FROM Warehouses 
  INNER JOIN WarehouseType ON (WarehouseType.TypeID = Warehouses.Type)
  LEFT JOIN WHProdAmount ON (WHProdAmount.WHID = Warehouses.UID)
  LEFT JOIN DailyReports ON (DailyReports.WHID = Warehouses.UID)
  LEFT JOIN WHOwnerChilds ON (WHOwnerChilds.ChildID = Warehouses.UID)
  LEFT JOIN Warehouses as ParentWH ON (ParentWH.UID = WHOwnerChilds.OwnerID)
  LEFT JOIN WarehouseType as ParentType ON (ParentType.TypeID = ParentWH.Type)
  WHERE isnull(WHProdAmount.DateModified, Warehouses.DateModified) 
            > '${lastFetched || ''}'
  GROUP BY Warehouses.UID, Warehouses.Name, WarehouseType.TypeDescription,
           ParentWH.Name, ParentType.TypeDescription
`
    )
    .then((res) => res.recordset)
    .catch((e) => console.log(e))

  sql.close()

  console.log(`Done, there are ${warehouses.length} warehouses`)

  return warehouses
}

module.exports.default = get_wh_amounts
