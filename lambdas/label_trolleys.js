const sql = require('mssql')
const mqtt = require('async-mqtt')

const label_trolleys = async ({ db, flock, date, wh, label }) => {
  if (!db) throw Error('Missing DB')
  if (!label) throw Error('Missing label')
  if (!flock) throw Error('Missing flock name')
  if (!date) throw Error('Missing date')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw Error('Bad date format')

  console.log(
    `Looking for products after ${date} in flock ${flock} in warehouse ${
      wh || 'ANY'
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

  const products = await new sql.Request()
    .query(
      `
  select ProdID from WHProdAmount
  where ${
    wh ? `WHID in (select UID from Warehouses where Name = '${wh}') and` : ''
  }
  ProdID in
      (select UID from Products
          where FlockID in (select UID from Flocks where Name = '${flock}') and
          LayingDate >= '${date}' and
          PlanningState = 0
      )`
    )
    .then((res) => {
      if (res.recordset) return res.recordset.map((item) => item.ProdID)
    })
    .catch((e) => console.log(e))

  sql.close()

  console.log(`Products to label as ${label}: `, products)

  const options = {
    clean: true,
    connectTimeout: 4000,
  }
  const client = await mqtt.connectAsync('mqtt://3.127.195.30:1883', options)

  await Promise.all(
    products.map((id) =>
      client.publish(
        `yxtmmsg/${id}/label`,
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

  return 'Done'
}

module.exports.default = label_trolleys
