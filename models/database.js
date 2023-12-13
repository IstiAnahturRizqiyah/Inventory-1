const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  password: '200061',
  database: 'bd_bunga',
  host: 'localhost',
  port: 5432,
});

module.exports = pool;
