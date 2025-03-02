const sql = require('mssql');
const { generateID, getHashPassword } = require('../functions');
const { getAccountByUsername, getAccountById, findFriend } = require('./reusableSqlFunctions');
const { tables, getPool } = require('./sqlConfig');
const { accounts, friendList, messages } = tables;


exports.register = async function ({ username, password }) {
    const pool = await getPool();

    const check = await getAccountByUsername(username);
    if (check.recordset.length > 0) throw new Error('username already exists');
    const hashedPassword = await getHashPassword(password);
    const id = generateID(80);
    await pool.request()
        .input('id', sql.VarChar, id)
        .input('username', sql.VarChar, username)
        .input('password', sql.VarChar, hashedPassword)
        .input('img', sql.VarChar, null)
        .query(`INSERT INTO ${accounts} (id,username,password,img) VALUES( @id,@username,@password,@img)`);
    let account = await getAccountByUsername(username);
    account = account.recordset[0];


    return ({ account });
}
exports.login = async function ({ username }) {
    let account = await getAccountByUsername(username);
    if (account.recordset.length === 0) throw new Error('username or password may be wrong');
    account = account.recordset[0];

    return ({ account });

}
exports.updateImg = async function ({ userId, uploadedImg }) {
    const pool = await getPool();

    await pool.request()
        .input('id', sql.VarChar, userId)
        .input('uploadedImg', sql.VarChar, uploadedImg)
        .query(`UPDATE ${accounts} SET img = @uploadedImg WHERE id = @id `);

    return { status: 'success' };
}

exports.queryAccounts = async function ({ username, userId }) {

    const pool = await getPool();
    let account = await pool.request()
        .query(`SELECT id,username,img FROM ${accounts} WHERE username like '%${username}%'`);

    account = account.recordset;
    let friendsIdArray = [];
    for (const item of account) {
        const friend = await findFriend({ userId, friendId: item.id });
        if (friend.recordset.length > 0) friendsIdArray.push(friend.recordset[0].id);

    }
    const accountFiltred = account.filter(item => item.id !== userId && !friendsIdArray.includes(item.id));

    if (accountFiltred.length > 0) return { query: accountFiltred };
    else throw new Error('no user found');

}
exports.insertFriendList = async function ({ userId, friendId, username, status = '1' }) {
    const pool = await getPool();
    const check = await findFriend({ userId, friendId });

    if (check.recordset.length > 0) throw new Error('you already added this friend');

    await pool.request()
        .input('userId', sql.VarChar, userId)
        .input('friendId', sql.VarChar, friendId)
        .input('username', sql.VarChar, username)
        .input('status', sql.VarChar, status)
        .query(`INSERT INTO ${friendList} (id,friendId,friendUsername,status) values (@friendId,@userId,@username,@status)`)

    return { status: 'success' };
}
exports.updateFriendList = async function ({ userId, friendId }) {

    const pool = await getPool();

    await pool.request()
        .input('userId', sql.VarChar, userId)
        .input('friendId', sql.VarChar, friendId)
        .query(`UPDATE ${friendList} SET status = '2' WHERE id = @userId and friendId = @friendId`);

    return ({ status: 'success' });
}
exports.deleteFriendList = async function ({ userId, friendId }) {
    const pool = await getPool();

    await pool.request()
        .input('userId', sql.VarChar, userId)
        .input('friendId', sql.VarChar, friendId)
        .query(`DELETE FROM ${friendList} WHERE id = @userId and friendId = @friendId`);

}
exports.getFriendRequests = async function ({ userId }) {
    const pool = await getPool();
    let res = await pool.request()
        .input('userId', sql.VarChar, userId)
        .query(`SELECT * FROM ${friendList} WHERE id=@userId AND status = '1'`);
    res = res.recordset;
    if (res.length < 0) throw new Error('no friend Requests 🫤');

    const friendRequests = [];
    for (const item of res) {
        const friend = await getAccountById(item.friendId);
        if (friend.recordset.length > 0) friendRequests.push(friend.recordset[0]);

    };

    return friendRequests;
}
exports.insertMessage = async function ({ userId, friendId, message, status }) {
    const pool = await getPool();
    const timestamp = new Date(); // Generates the current timestamp

    await pool.request()
        .input('userId', sql.VarChar, userId)
        .input('friendId', sql.VarChar, friendId)
        .input('message', sql.VarChar, message)
        .input('status', sql.VarChar, status)
        .input('timestamp', sql.DateTime, timestamp) // Insert the timestamp
        .query(`INSERT INTO messages (id, friendId, status, message, timestamp) VALUES (@userId, @friendId, @status, @message, @timestamp)`);
}
exports.getMessages = async function ({ userId, friendId }) {

    const pool = await getPool();

    const res = await pool.request()
        .input('userId', sql.VarChar, userId)
        .input('friendId', sql.VarChar, friendId)
        .query('SELECT * FROM messages WHERE id=@userId and friendId=@friendId ORDER by timestamp');

    return res;
}
exports.getLastMessage = async function ({ userId, friendId }) {

    const pool = await sql.connect(config)
    const lastMessage = await pool.request()
        .input('userId', sql.VarChar, userId)
        .input('friendId', sql.VarChar, friendId)
        .query(`SELECT TOP 1 * FROM messages WHERE id = @userId AND friendId = @friendId and Status = 'recipient'ORDER BY timestamp desc`);
    if (lastMessage.recordset.length === 0) throw new Error('No message yet.✉️');
    return lastMessage.recordset[0];
};  