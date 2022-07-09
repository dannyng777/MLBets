const Pool = require('pg-pool')

const pool = new Pool({
    user: '',
    password: '',
    database: 'mlbets_database',
    host: 'localhost',
    port: '5434'
})

module.exports = pool;