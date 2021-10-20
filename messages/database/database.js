import { Pool } from "https://deno.land/x/postgres@v0.12.0/mod.ts";

const CONCURRENT_CONNECTIONS = 2;
const connectionPool = new Pool({
  hostname: "hattie.db.elephantsql.com",
  database: "nuwrucez",
  user: "nuwrucez",
  password: "jbjGe9dwwUOm2ndZa0Kste1PC1zvJCIE",
  port: 7777,
}, CONCURRENT_CONNECTIONS);

const executeQuery = async (query, ...args) => {
  const response = {};
  let client;

  try {
    client = await connectionPool.connect();
    const result = await client.queryObject(query, ...args);
    if (result.rows) {
      response.rows = result.rows;
    }
  } catch (e) {
    response.error = e;
  } finally {
    if (client) {
      try {
        await client.release();
      } catch (e) {
        console.log("Unable to release database connection.");
        console.log(e);
      }
    }
  }

  return response;
};

export { executeQuery };