import mysql from 'mysql2/promise';

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const query = async (sql, params = []) => {
  const connection = await mysql.createConnection(config);
  const [results] = await connection.execute(sql, params);
  return results;
};

export { query };
