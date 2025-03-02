const dotenv = require('dotenv');
dotenv.config({ path: './configDocker.env' });
const sql = require('mssql');


const accounts = process.env.ACCOUNTS;
const friendList = process.env.FRIEND_LIST;
const messages = process.env.MESSAGES;
const sqlUser = process.env.USER;
const sqlPassword = process.env.PASSWORD;
const database = process.env.DATABASE;
const sqlServer = process.env.DB_SERVER;
const sqlPort = process.env.DB_PORT;

config = {
    user: sqlUser,
    password: sqlPassword,
    server: sqlServer,
    port: Number(sqlPort),
    database: database,
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
};



// We’ll store the pool as a global or module-level variable
let pool;

exports.getPool = async function () {
    // If we already have a pool, return it
    if (pool) {
        return pool;
    }
    console.log(pool);
    try {
        // If we reach here, no existing pool -> create a new one
        pool = await sql.connect(config);
        return pool;
    } catch (err) {
        throw new Error("server error");

    }
}

exports.tables = {
    accounts,
    friendList,
    messages
}