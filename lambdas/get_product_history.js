const sql = require('mssql')

const get_product_history = async ({ db, uid }) => {
  if (!db) throw Error('Missing DB')
  if (!uid) throw Error('Missing UID')

  console.log(`Getting ${uid} product history from ${db}`)

  const config = {
    user: 'sa',
    password: 'Yieldxbiz2021',
    server: '3.127.195.30',
    database: db,
    options: { encrypt: false },
  }
  await sql.connect(config).catch((e) => console.log(e))

  const [TransHistory, SensorHistory] = await new sql.Request()
    .query(
      `
  WITH Parents as (
    SELECT UID, Name, ParentProduct, FlockWHID, LayingDate, InitAmount, 
           TrolleyUID
    FROM Products
    WHERE UID = '${uid}'
    UNION ALL
    SELECT c.UID, c.Name, c.ParentProduct, c.FlockWHID, c.LayingDate, 
           c.InitAmount, c.TrolleyUID
    FROM Products c
    JOIN Parents p on p.ParentProduct = c.UID 
  ) 
  
  SELECT * 
  INTO #ProductHistory
  FROM (
    SELECT TOP 1 UID as Product, Name, LayingDate as CreateDate,
           null as SourceWH, FlockWHID as DestinationWH, InitAmount as Amount, 
           ParentProduct, TrolleyUID
    FROM Parents 
    ORDER BY CreateDate
  ) as foobar
  UNION ALL
  SELECT Product, Name, CreateDate, SourceWH, DestinationWH, Amount,
         ParentProduct, TrolleyUID
  FROM Parents p
  JOIN EZTransactions on p.UID = Product
  ORDER BY CreateDate

  SELECT * FROM #ProductHistory
  
  SELECT DateCreate, 
         round(avg(CASE WHEN SubType = 0 
                        THEN convert(float, Value) END) * 10, 1) as Temp,
         round(avg(CASE WHEN SubType = 2 
                        THEN convert(float, Value) END), 1) as Humidity,
         round(avg(CASE WHEN SubType = 3 
                        THEN convert(float, Value) END) * 100000, 0) as Baro,
         avg(CASE WHEN SubType = 8 THEN convert(float, Value) END) as CO2
  FROM Sensors 
  WHERE SensorType = 10 and isnumeric(Value) = 1 and
        DeviceUID in (SELECT TrolleyUID FROM #ProductHistory)
  GROUP BY DateCreate
  ORDER BY DateCreate desc

  DROP TABLE #ProductHistory
`
    )
    .then((res) => res.recordsets)
    .catch((e) => console.log(e))

  sql.close()

  console.log(
    `Done, got ${TransHistory.length} product history records and ${SensorHistory.length} sensor records`
  )

  return { TransHistory, SensorHistory }
}

module.exports.default = get_product_history
