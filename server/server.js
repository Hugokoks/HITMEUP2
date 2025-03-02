///json packages
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



///SQL 
const { register, login, updateImg, queryAccounts, insertFriendList,
    getFriendRequests, updateFriendList, deleteFriendList, getMessages, getLastMessage } = require('./SQL/db');
const { getAccountById, getAccountByUsername, getFriendList } = require('./SQL/reusableSqlFunctions');

///middlewares
const { deleteFile } = require('./functions');
const asyncHandler = require('./middleware/asyncHandler');
const errorHandler = require('./middleware/errorHandler');
const verifyToken = require('./middleware/verifyJWT');
const uploadFile = require('./middleware/uploadFile');

////server features declaration
const app = express();
dotenv.config({ path: './configDocker.env' });
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const key = process.env.KEY;


////API Handlers
app.post('/api/register', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const { account } = await register({ username: username, password: password });

    const token = jwt.sign({ id: account.id, username: account.username }, key, { expiresIn: '1h' });
    res.status(200).json({
        status: 'success',
        token,
        id: account.id,
    });

}));
app.post('/api/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const { account } = await login({ username });
    const { password: passwordHashed } = account;
    const isMatch = await bcrypt.compare(password, passwordHashed);

    if (!isMatch) throw new Error('username or password may be wrong');

    const token = jwt.sign({ id: account.id, username: account.username }, key, { expiresIn: '1h' });

    res.status(200).json({
        status: 'success',
        token,
        id: account.id
    })

}));
app.get('/api/user_verify', verifyToken, asyncHandler(async (req, res) => {
    const request = await getAccountById(req.userIdToken);
    const { username, img, id } = request.recordset[0];

    res.status(200).json({
        status: 'success',
        id,
        username,
        img
    })
}));

app.post('/api/uploadImg', verifyToken, uploadFile, asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const uploadedImg = req.fileID;
    if (req.userIdToken !== userId) {
        deleteFile(uploadedImg);
        throw new Error('Unauthorized: You can only update your own data')
    };
    let request = await getAccountById(userId);
    const { img: profileImg } = request.recordset[0];

    if (profileImg !== null) deleteFile(profileImg);

    request = await updateImg({ uploadedImg, userId });
    res.status(200).json({ status: 'success', uploadedImg });



}));
app.get('/api/accountQuery', verifyToken, asyncHandler(async (req, res) => {
    const { username, userId } = req.query;
    const { query } = await queryAccounts({ username, userId });
    res.status(200).json({ status: 'success', query });
}));

app.post('/api/addFriend', verifyToken, asyncHandler(async (req, res) => {
    const { userId, friendId } = req.body;
    let username = await getAccountById(userId);
    username = username.recordset[0].username;
    const add = await insertFriendList({ userId, friendId, username });
    //console.log(add);
    res.status(200).json({ status: 'success', message: 'response sent to user' });


}));
app.get('/api/getFriendRequests', verifyToken, asyncHandler(async (req, res) => {
    const { id } = req.query;

    const friendRequests = await getFriendRequests({ userId: id });
    //console.log(friendRequests);
    res.status(200).json({ status: 'success', friendRequests });
}));
app.post('/api/handleFriendRequests', verifyToken, asyncHandler(async (req, res) => {
    const { userId, friendId, action } = req.body;
    if (!action) return;
    let username = await getAccountById(userId);
    username = username.recordset[0].username;

    if (action === 'remove') {
        let sqlRes = await deleteFriendList({ userId, friendId });
        res.status(200).json({ status: 'success', message: 'user remove from Friend list' });

    }
    if (action === 'add') {

        let sqlRes = await insertFriendList({ userId, username, friendId, status: '2' });
        sqlRes = await updateFriendList({ userId, friendId });
        res.status(200).json({ status: 'success', message: 'friend added' });
    }
}));
app.post('/api/removeFriend', verifyToken, asyncHandler(async (req, res) => {
    const { focused: { friendId }, userId } = req.body;
    //console.log(friendId, userId);

    let sqlReq = await deleteFriendList({ userId, friendId });
    sqlReq = await deleteFriendList({ userId: friendId, friendId: userId });

    res.status(200).json({ status: 'success', message: 'user removed from friends' });

}));
app.get('/api/getFriendList', verifyToken, asyncHandler(async (req, res) => {
    const { id: userId } = req.query;
    const friendList = await getFriendList({ userId });
    const friendListArray = [];
    for (const item of friendList) {
        const friend = await getAccountById(item.friendId, false);
        if (friend.recordset.length > 0) friendListArray.push(friend.recordset[0]);
    }

    res.status(200).json({ status: 'success', friendListArray });

}));
app.get('/api/getMessages', verifyToken, asyncHandler(async (req, res) => {
    const { id: userId, friendId } = req.query;
    const sqlRes = await getMessages({ userId, friendId });

    res.status(200).json({ status: "success", data: sqlRes.recordset });


}));

app.get('/api/getLastMessage', verifyToken, asyncHandler(async (req, res) => {
    const { id: userId, friendId } = req.query;

    const sqlRes = await getLastMessage({ userId, friendId });
    res.status(200).json({ status: 'success', data: sqlRes })
}));
app.use(errorHandler);


////server run
const IP = '0.0.0.0';
const PORT = process.env.PORT;

app.listen(PORT, IP, () => {
    console.log(`server is running on port ${PORT}`);


});
