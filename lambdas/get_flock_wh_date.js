const sql = require('mssql')

const get_flock_wh_date = async ({ db }) => {
  if (!db) throw Error('Missing DB')

  console.log(`Getting a list of flocks in ${db}`)

  const config = {
    user: 'sa',
    password: 'Yieldxbiz2021',
    server: '3.127.195.30',
    database: db,
    options: { encrypt: false },
  }
  await sql.connect(config).catch((e) => console.log(e))

  const flocks = await new sql.Request()
    .query(
      `
SELECT FlockID, Flocks.Name AS FlockName, SourceWH.UID AS SourceID,
       SourceWH.Name AS SourceName, DestWH.UID AS DestID, 
       DestWH.Name AS DestName, min(LayingDate) AS EarliestLaying
FROM Flocks
INNER JOIN Products ON (Products.FlockID = Flocks.UID)
INNER JOIN WHProdAmount ON (WHProdAmount.ProdID = Products.UID)
INNER JOIN Warehouses AS SourceWH ON (SourceWH.UID = Products.FlockWHID)
INNER JOIN Warehouses AS DestWH ON (DestWH.UID = WHProdAmount.WHID)
WHERE Amount > 0 AND PlanningState = 0
GROUP BY FlockID, Flocks.Name, SourceWH.UID, SourceWH.Name, DestWH.UID, 
         DestWH.Name
      `
    )
    .then((res) => res.recordset || [])
    .catch((e) => console.log(e))

  sql.close()

  console.log(`Done, there are ${Object.keys(flocks).length} flocks`)

  return flocks
}

module.exports.default = get_flock_wh_date
