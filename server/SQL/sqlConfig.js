const dotenv = require('dotenv');
dotenv.config({ path: './configHome.env' });

const accounts = process.env.ACCOUNTS;
const friendList = process.env.FRIEND_LIST;
const messages = process.env.MESSAGES;
const sqlUser = process.env.USER;
const sqlPassword = process.env.PASSWORD;
const database = process.env.DATABASE;
const sqlServer = process.env.DB_SERVER;
const sqlPort = process.env.DB_PORT;

exports.config = {
    user: sqlUser,
    password: sqlPassword,
    server: sqlServer,
    port: sqlPort,
    database: database,
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
};
exports.tables = {
    accounts,
    friendList,
    messages


}
