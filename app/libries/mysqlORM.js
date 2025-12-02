const knex = require('knex');
const { mysqlCredentials } = require('../../env');

const db = knex({
  client: 'mysql2',
  connection: mysqlCredentials
});

// Test connection
// db.raw('SELECT 1').then(() => console.log('MySQL connected using Knex')).catch(err => console.error('Connection error:', err));

module.exports = db;
