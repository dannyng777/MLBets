const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    password: 'hello123',
    database: 'mlbets_database',
    host: 'localhost',
    port: '5432'
})

module.exports = pool;