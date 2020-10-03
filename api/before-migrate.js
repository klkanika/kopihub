require('dotenv').config({
  path: './prisma/.env',
})
const { Client } = require('pg')
console.log('pg')
console.log(process.env.DATABASE_URL)
const client = new Client({
  connectionString: process.env.DATABASE_URL,
})
console.log('start')
let done = false
;(async () => {
  try {
    await client.connect()
    try {
      const res = await client.query('DELETE FROM "public"."_Migration"')
    } catch (ex) {
      console.log(ex)
    }
    await client.end()
    done = true
  } catch (ex) {}
  console.log('delete')
})()
