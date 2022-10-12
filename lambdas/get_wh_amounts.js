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
         isnull((SELECT sum(Amount) FROM WHProdAmount WHERE Amount > 0 and 
                 WHID = Warehouses.UID), 0) as AmountTotal,
         (SELECT isnull(sum(CASE WHEN CONVERT(DATE, ReportDate) = 
                                        CONVERT(DATE, getdate())
                                 THEN TotalProdEgg
                            END), 0) FROM DailyReports WHERE WHID 
                                            = Warehouses.UID) as AmountToday,
         max(WHProdAmount.DateModified) as DateModified,
         ParentWH.Name as OwnerName, ParentType.TypeDescription as OwnerType,
		     Temp, Humidity, Baro, CO2
  FROM Warehouses 
  OUTER APPLY (
  	SELECT [0] as Temp, [2] as Humidity, [3] as Baro, [8] as CO2
  	FROM (
      SELECT SubType, convert(float, Value) as Value 
      FROM (
              SELECT *, Rank()
                over (Partition BY concat(DeviceUID, '|', SubType)
                      ORDER BY DateModified DESC) AS Rank
              FROM Sensors) rs 
      WHERE Rank <= 10 and isnumeric(Value) = 1 and DeviceUID in 
            (select TrolleyUID from Products where UID in 
              (select ProdID from WHProdAmount where WHID = Warehouses.UID))
    ) as SourceTable   
    PIVOT(avg(Value) for SubType in ([0], [2], [3], [8])) as PivotTable
  ) as SensorData
  INNER JOIN WarehouseType ON (WarehouseType.TypeID = Warehouses.Type)
  LEFT JOIN WHProdAmount ON (WHProdAmount.WHID = Warehouses.UID)
  LEFT JOIN WHOwnerChilds ON (WHOwnerChilds.ChildID = Warehouses.UID)
  LEFT JOIN Warehouses as ParentWH ON (ParentWH.UID = WHOwnerChilds.OwnerID)
  LEFT JOIN WarehouseType as ParentType ON (ParentType.TypeID = ParentWH.Type)
  WHERE isnull(WHProdAmount.DateModified, Warehouses.DateModified) 
            > '${lastFetched || ''}'
  GROUP BY Warehouses.UID, Warehouses.Name, WarehouseType.TypeDescription,
           ParentWH.Name, ParentType.TypeDescription, Temp, Humidity, Baro, CO2
`
    )
    .then((res) => res.recordset)
    .catch((e) => console.log(e))

  sql.close()

  console.log(`Done, there are ${warehouses.length} warehouses`)

  return warehouses
}

module.exports.default = get_wh_amounts
