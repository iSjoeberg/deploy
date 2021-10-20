import { executeQuery } from "../database/database.js";

const send = async (sender, message) => {
  await executeQuery(
    "INSERT INTO messages (sender, message) VALUES ($1, $2);",
    sender,
    message,
  );
};

const deleteById = async (id) => {
  await executeQuery("DELETE FROM addresses WHERE id = $1;", id);
};

const findAll = async () => {
  let result = await executeQuery("SELECT * FROM messages ORDER BY id DESC LIMIT 5;");
  return result.rows;
};

const findFive = async () => {
    let result = await executeQuery("SELECT * FROM messages LIMIT 5;");
    return result.rows;
};

const findByNameOrAddressLike = async (nameOrAddress) => {
  const likePart = `%${nameOrAddress}%`;

  let result = await executeQuery(
    "SELECT * FROM addresses WHERE name ILIKE $1 OR address ILIKE $2;",
    likePart,
    likePart,
  );

  return result.rows;
};

export { send, deleteById, findAll, findFive, findByNameOrAddressLike };