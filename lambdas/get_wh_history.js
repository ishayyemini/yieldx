const sql = require('mssql')

const get_wh_history = async ({ db, wh }) => {
  if (!db) throw Error('Missing DB')
  if (!wh) throw Error('Missing WH')

  console.log(`Getting sensors and eggs history from ${db} in ${wh} warehouse`)

  const config = {
    user: 'sa',
    password: 'Yieldxbiz2021',
    server: '3.127.195.30',
    database: db,
    options: { encrypt: false },
  }
  await sql.connect(config).catch((e) => console.log(e))

  const [SensorHistory, EggHistory] = await new sql.Request()
    .query(
      `
  SELECT DateCreate, 
         round(sum(CASE WHEN SubType = 0 
                        THEN convert(float, Value) END) * 10, 1) as Temp,
         round(sum(CASE WHEN SubType = 2 
                        THEN convert(float, Value) END), 1) as Humidity,
         round(sum(CASE WHEN SubType = 3 
                        THEN convert(float, Value) END) * 100000, 0) as Baro,
         sum(CASE WHEN SubType = 8 THEN convert(float, Value) END) as CO2
  FROM Sensors 
  WHERE SensorType = 10 and isnumeric(Value) = 1 and
        DeviceUID in (SELECT TrolleyUID FROM Products WHERE UID in 
                        (SELECT ProdID FROM WHProdAmount WHERE 
                            WHID = '${wh}'))
  GROUP BY DateCreate
  ORDER BY DateCreate desc
  
  SELECT eggs.DateAdded, sum(eggs.Amount) as DailyEggs
  FROM (
      SELECT DestinationWH as WHID, CreateDate as DateAdded, Amount FROM EZTransactions
      UNION
      SELECT WHID, ReportDate as DateAdded, TotalProdEgg as Amount FROM DailyReports
  ) eggs
  WHERE eggs.DateAdded <= getdate() and eggs.WHID  = '${wh}'
  GROUP BY eggs.DateAdded
  ORDER BY eggs.DateAdded desc
`
    )
    .then((res) => res.recordsets)
    .catch((e) => console.log(e))

  sql.close()

  console.log(
    `Done, got ${SensorHistory.length} sensor records and ${EggHistory.length} egg records`
  )

  return { SensorHistory, EggHistory }
}

module.exports.default = get_wh_history
