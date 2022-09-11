const sql = require('mssql')

const get_wh_amounts = async ({ db, lastFetched }) => {
  if (!db) throw Error('Missing DB')

  console.log(
    `Getting a list of Warehouses in ${db} ${
      lastFetched ? `modified after ${lastFetched}` : null
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
      `select UID, Name, Type, Amount, DateModified from (select UID, Name, 
(select TypeDescription from WarehouseType wt1 where wt1.TypeID = w1.Type) as Type, 
(select sum(Amount) from WHProdAmount wa1 where wa1.WHID = w1.UID) as Amount, 
(select max(DateModified) from WHProdAmount wa1 where wa1.WHID = w1.UID) as DateModified
from Warehouses w1) as foobar where DateModified > '${lastFetched || ''}'`
    )
    .then((res) => res.recordset)
    .catch((e) => console.log(e))

  sql.close()

  console.log(`Done, there are ${warehouses.length} warehouses`)

  return warehouses
}

module.exports.default = get_wh_amounts
