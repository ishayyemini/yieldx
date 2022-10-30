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

  const history = await new sql.Request()
    .query(
      `
  WITH Parents as (
    SELECT UID, Name, ParentProduct, FlockWHID, LayingDate, InitAmount
    FROM Products
    WHERE UID = '${uid}'
    UNION ALL
    SELECT c.UID, c.Name, c.ParentProduct, c.FlockWHID, c.LayingDate, c.InitAmount
    FROM Products c
    JOIN Parents p on p.ParentProduct = c.UID 
  ) 
  
  SELECT * 
  FROM (
    SELECT TOP 1 UID as Product, Name, LayingDate as CreateDate,
           null as SourceWH, FlockWHID as DestinationWH, InitAmount as Amount, 
           ParentProduct 
    FROM Parents 
    ORDER BY CreateDate
  ) as foobar
  UNION ALL
  SELECT Product, Name, CreateDate, SourceWH, DestinationWH, Amount, ParentProduct
  FROM Parents p
  JOIN EZTransactions on p.UID = Product
  ORDER BY CreateDate
`
    )
    .then((res) => res.recordset)
    .catch((e) => console.log(e))

  sql.close()

  console.log(`Done, got ${history.length} records`)

  return history
}

module.exports.default = get_product_history
