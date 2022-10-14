const sql = require('mssql')

const get_sensor_history = async ({ db, wh }) => {
  if (!db) throw Error('Missing DB')

  console.log(`Getting sensor history from ${db} in ${wh} warehouse`)

  const config = {
    user: 'sa',
    password: 'Yieldxbiz2021',
    server: '3.127.195.30',
    database: db,
    options: { encrypt: false },
  }
  await sql.connect(config).catch((e) => console.log(e))

  const sensors = await new sql.Request()
    .query(
      `
  SELECT DateModified, SubType, Value
  FROM Sensors 
  WHERE SensorType = 10 and isnumeric(Value) = 1 and
        DeviceUID in (SELECT TrolleyUID FROM Products WHERE UID in 
                        (SELECT ProdID FROM WHProdAmount WHERE 
                            WHID = 'EF8A6A72-FEFA-4034-A313-AEE11D4B6F97'))
  ORDER BY DateModified desc
`
    )
    .then((res) => res.recordset)
    .catch((e) => console.log(e))

  sql.close()

  console.log(`Done, got ${sensors.length} records`)

  return sensors
}

module.exports.default = get_sensor_history
