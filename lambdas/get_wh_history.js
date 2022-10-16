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

  const [sensors, eggs] = await new sql.Request()
    .query(
      `
  SELECT DateModified, SubType, Value
  FROM Sensors 
  WHERE SensorType = 10 and isnumeric(Value) = 1 and
        DeviceUID in (SELECT TrolleyUID FROM Products WHERE UID in 
                        (SELECT ProdID FROM WHProdAmount WHERE 
                            WHID = '${wh}'))
  ORDER BY DateModified desc
  
  SELECT ReportDate, sum(TotalProdEgg) as DailyEggs
  FROM DailyReports 
  WHERE ReportDate < getdate() and WHID  = '${wh}'
  GROUP BY ReportDate
  ORDER BY ReportDate desc
`
    )
    .then((res) => res.recordsets)
    .catch((e) => console.log(e))

  sql.close()

  console.log(
    `Done, got ${sensors.length} sensor records and ${eggs.length} egg records`
  )

  return { sensors, eggs }
}

module.exports.default = get_wh_history
