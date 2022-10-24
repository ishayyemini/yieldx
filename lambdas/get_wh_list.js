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

  const warehouses = await new sql.Request()
    .query(
      `
  SELECT Warehouses.UID as UID, Warehouses.Name as Name, OwnerID,
         TypeDescription as Type,
         isnull(string_agg(convert(NVARCHAR(max), WHProdAmount.ProdID), ','),
                '') as Products
  FROM Warehouses 
  INNER JOIN WarehouseType ON (WarehouseType.TypeID = Warehouses.Type)
  LEFT JOIN WHProdAmount ON (WHProdAmount.WHID = Warehouses.UID and
                             WHProdAmount.Amount > 0)
  LEFT JOIN WHOwnerChilds ON (WHOwnerChilds.ChildID = Warehouses.UID)
  GROUP BY Warehouses.UID, Warehouses.Name, OwnerID, TypeDescription
`
    )
    .then((res) =>
      res.recordset.map((item) => ({
        ...item,
        Products: Object.fromEntries(
          item.Products.split(',').map((item) => [item, { UID: item }])
        ),
      }))
    )
    .catch((e) => console.log(e))

  sql.close()

  console.log(`Done, there are ${warehouses.length} warehouses`)

  return warehouses
}

module.exports.default = get_wh_list
