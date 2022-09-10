const sql = require('mssql')
const mqtt = require('async-mqtt')

const label_trolleys = async ({
  db,
  flock,
  date,
  wh,
  label,
  mqtt: mqttUrl,
}) => {
  if (!db) throw Error('Missing DB')
  if (!label) throw Error('Missing label')
  if (!flock) throw Error('Missing flock name')
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw Error('Bad date format')

  console.log(
    `Looking for products${
      date ? ' after ' + date : ''
    } in flock ${flock} in warehouse ${wh || 'ANY'}`
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
  select wa1.ProdID, wa1.Amount, 
  (select Name from Warehouses whs1 where whs1.UID = wa1.WHID) as "Warehouse",
  (select (select Name from ProductTypes pt1 where p1.Type = pt1.UID) 
    from Products p1 where p1.UID = wa1.ProdID) as "Type"
  from WHProdAmount wa1
  where ${
    wh ? `WHID in (select UID from Warehouses where Name = '${wh}') and` : ''
  }
  ProdID in
      (select UID from Products
          where FlockID in (select UID from Flocks where Name = '${flock}') and
          ${date ? ` LayingDate >= '${date}' and ` : ''}
          PlanningState = 0
      )`
    )
    .then((res) => res.recordset ?? [])
    .catch((e) => console.log(e))

  sql.close()

  console.log(`Products to label as ${label}: `, products)

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
        `yxtmmsg/${product.ProdID}/label`,
        // TODO retain true!
        JSON.stringify({
          TS: Math.round(Date.now() / 1000),
          Label: label,
          RelObject: 2,
        })
      )
    )
  )
  await client.end()
  console.log('Done')

  return products
}

module.exports.default = label_trolleys
