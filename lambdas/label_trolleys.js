const sql = require('mssql')
const mqtt = require('async-mqtt')

const label_trolleys = async ({
  db,
  flock,
  date,
  rolling,
  sourceWH,
  destWH,
  label1,
  label2,
  mqtt: mqttUrl,
}) => {
  if (!db) throw Error('Missing DB')
  if (!label1) throw Error('Missing label')
  if (!flock) throw Error('Missing flock ID')
  if (!date) date = new Date().toISOString().split('T')[0]
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw Error('Bad date format')

  console.log(
    `Looking for products before ${date} in flock ${flock} from ${
      sourceWH || 'ANY'
    } in ${destWH || 'ANY'}`
  )

  const config = {
    user: 'sa',
    password: 'Yieldxbiz2021',
    server: '3.127.195.30',
    database: db,
    options: { encrypt: false },
  }
  await sql.connect(config).catch((e) => console.log(e))

  // Gather list of product IDs
  const products = await new sql.Request()
    .query(
      `
  SELECT ProdID, FlockID, FlockWHID as SourceWH, WHID as DestWH, LayingDate,
         Amount, TrolleyUID, ProductTypes.Name as Type,
         Warehouses.Name as DestName
  FROM WHProdAmount
  INNER JOIN Products ON (Products.UID = WHProdAmount.ProdID)
  INNER JOIN ProductTypes ON (ProductTypes.UID = Products.Type)
  INNER JOIN Warehouses ON (Warehouses.UID = WHProdAmount.WHID)
  WHERE PlanningState = 0 and Amount != 0 and FlockID = '${flock}' and
        ${sourceWH.length ? `FlockWHID in (${sourceWH}) and ` : ''}
        ${destWH.length ? `WHID in (${destWH}) and ` : ''}
        LayingDate < '${date}'
  `
    )
    .then((res) => res.recordset ?? [])
    .catch((e) => console.log(e))

  sql.close()

  console.log(
    `Products to label as ${label1}${label2 ? `, ${label2}` : null}: `,
    products
  )

  const options = {
    clean: true,
    connectTimeout: 4000,
  }
  const client = await mqtt.connectAsync(
    mqttUrl || 'mqtt://broker.mqttdashboard.com:1883',
    options
  )

  console.log(
    `Sending MQTT to ${mqttUrl || 'mqtt://broker.mqttdashboard.com:1883'}`
  )

  // Send MQTT alerts
  await Promise.all(
    products.map((product) =>
      client.publish(
        `yxtmmsg/${product.TrolleyUID}/Beep`,
        JSON.stringify({
          TS: Math.round(Date.now() / 1000),
          AlertMessage: label1,
          Data: label2 || '',
          Rolling: rolling,
          Total: products.length,
          RelObject: 2,
        }),
        { retain: true }
      )
    )
  )
  await client.end()
  console.log('Done')

  return products
}

module.exports.default = label_trolleys
