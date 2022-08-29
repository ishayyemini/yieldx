const sql = require('mssql')

const check_user = async ({ db }) => {
  if (!db) throw Error('Missing DB')

  console.log(`Checking if DB ${db} exists`)

  const config = {
    user: 'sa',
    password: 'Yieldxbiz2021',
    server: '3.127.195.30',
    database: 'master',
    options: { encrypt: false },
  }
  await sql.connect(config).catch((e) => console.log(e))

  const exists = await new sql.Request()
    .query(`SELECT DB_ID('${db}')`)
    .then((res) => {
      if (res.recordset) return Object.values(res.recordset[0])[0] !== null
    })
    .catch((e) => console.log(e))

  sql.close()

  console.log(`Done, DB ${exists ? 'exists' : "doesn't exist"}`)

  return exists
}

module.exports.default = check_user
