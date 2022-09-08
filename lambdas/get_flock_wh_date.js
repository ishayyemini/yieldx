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

  const flockNames = await new sql.Request()
    .query(
      `SELECT Name FROM Flocks WHERE UID in 
                (SELECT FlockID FROM Products WHERE PlanningState = 0)`
    )
    .then((res) => {
      if (res.recordset) return res.recordset.map((item) => item.Name)
    })
    .catch((e) => console.log(e))

  const flocks = Object.fromEntries(
    await Promise.all(
      flockNames.map((fName) =>
        new sql.Request()
          .query(
            `SELECT Name FROM Warehouses WHERE UID in 
                    (SELECT WHID FROM WHProdAmount WHERE ProdID in 
                        (SELECT UID FROM Products
                        WHERE FlockID in (SELECT UID FROM Flocks WHERE Name = '${fName}') and
                        PlanningState = 0))`
          )
          .then((res) => {
            if (res.recordset)
              return [
                fName,
                Object.fromEntries(res.recordset.map((item) => [item.Name, 0])),
              ]
          })
          .catch((e) => console.log(e))
      )
    )
  )

  await Promise.all(
    Object.entries(flocks).map(([fName, WHs]) =>
      Promise.all(
        Object.keys(WHs).map((WH) =>
          new sql.Request()
            .query(
              `SELECT LayingDate FROM Products
                        WHERE PlanningState = 0 and FlockID in
                        (select UID from Flocks where Name = '${fName}') and
                        UID in (SELECT ProdID FROM WHProdAmount WHERE WHID in
                        (select UID from Warehouses where Name = '${WH}'))`
            )
            .then((res) => {
              if (res.recordset)
                flocks[fName][WH] = [
                  ...new Set(
                    res.recordset
                      .sort((a, b) => a.LayingDate - b.LayingDate)
                      .map(
                        (item) => item.LayingDate.toISOString().split('T')[0]
                      )
                  ),
                ]
            })
            .catch((e) => console.log(e))
        )
      )
    )
  )

  sql.close()

  console.log(`Done, there are ${Object.keys(flocks).length} flocks`)

  return flocks
}

module.exports.default = get_flock_wh_date
