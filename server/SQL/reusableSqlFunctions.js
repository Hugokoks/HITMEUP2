const { config, tables } = require('./sqlConfig');
const { accounts, friendList } = tables;
const sql = require('mssql');


exports.getAccountByUsername = async function (username) {
    const pool = await sql.connect(config);
    const account = await pool.request()
        .input('username', sql.VarChar, username)
        .query(`SELECT * FROM ${accounts} WHERE username = @username`);
    return account;
}

exports.getAccountById = async function (id, password = true) {
    const query = password ? `SELECT * FROM ${accounts} WHERE id = @id` : `SELECT id,username,img FROM ${accounts} WHERE id = @id`;
    const pool = await sql.connect(config);
    const account = await pool.request()
        .input('id', sql.VarChar, id)
        .query(query);

    return account;
}
exports.findFriend = async function ({ userId, friendId }) {

    const pool = await sql.connect(config);
    const friend = await pool.request()
        .input('userId', sql.VarChar, userId)
        .input('friendId', sql.VarChar, friendId)
        .query(`SELECT * FROM ${friendList} WHERE id=@friendId and friendId = @userId`);

    return friend;
}
exports.getFriendList = async function ({ userId }) {
    const pool = await sql.connect(config);
    const friends = await pool.request()
        .input('userId', sql.VarChar, userId)
        .query(`SELECT * FROM ${friendList} WHERE id=@userId AND status = '2'`);

    //console.log(friends.recordset);
    return friends.recordset;


}