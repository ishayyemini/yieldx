const sql = require('mssql')

const get_wh_list = async ({ db }) => {
  if (!db) throw Error('Missing DB')

  console.log(`Getting a list of Warehouses in ${db}`)

  const config = {
    user: 'sa',
    password: 'Yieldxbiz2021',
    server: '3.127.195.30',
    database: db,
    options: { encrypt: false },
  }
  await sql.connect(config).catch((e) => console.log(e))

  const [warehouses, products] = await new sql.Request()
    .query(
      `
  SELECT Warehouses.UID as UID, Warehouses.Name as Name, OwnerID,
         TypeDescription as Type
  FROM Warehouses 
  INNER JOIN WarehouseType ON (WarehouseType.TypeID = Warehouses.Type)
  LEFT JOIN WHOwnerChilds ON (WHOwnerChilds.ChildID = Warehouses.UID)
  GROUP BY Warehouses.UID, Warehouses.Name, OwnerID, TypeDescription
  
  SELECT UID, Name, LayingDate, WHID, Amount
  FROM Products
  INNER JOIN WHProdAmount ON (WHProdAmount.ProdID = UID and Amount > 0)
`
    )
    .then((res) => res.recordsets)
    .catch((e) => console.log(e))

  sql.close()

  console.log(
    `Done, there are ${warehouses.length} warehouses and ${products.length} products`
  )

  return { warehouses, products }
}

module.exports.default = get_wh_list
