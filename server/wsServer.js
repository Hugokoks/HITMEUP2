const http = require('http');
const { WebSocketServer } = require('ws');
const url = require('url');
const { insertMessage } = require('./SQL/db');
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { error } = require('console');
const key = process.env.KEY;


dotenv.config({ path: './configHome.env' });

const connected = {};
const users = {};


wsServer.on('connection', (connection, req) => {
    const { username, id, token } = url.parse(req.url, true).query;

    if (!username || !id || !token) {
        connection.terminate();
        return;
    };

    jwt.verify(token, key, (err, decoded) => {
        const decodedToken = decoded?.id;

        if (decodedToken !== id || err || !decodedToken) {
            connection.terminate();
            return;
        };
    });

    connected[id] = connection;
    users[id] = {
        username: username,
        status: {
            online: true,
            isTyping: false,

        },
    }
    broadcastOnlineUsers();

    connection.on('message', message => {
        const data = JSON.parse(message);


        if (data.type === 'text-message') {
            sendMessageToUser({ userId: id, friendId: data.friendId, message: data.message });
        };
        if (data.type === 'typing-event') {

            users[id].status.isTyping = data.status.isTyping;
            sendTypingStatus({ id, friendId: data.friendId });
        }

    });
    connection.on('close', () => handleClose(id));


});

async function sendMessageToUser({ userId, friendId, message }) {
    await insertMessage({ userId, friendId, message, status: 'sender' });
    await insertMessage({ userId: friendId, friendId: userId, message, status: 'recipient' });
    const endPointUser = connected[friendId];
    if (endPointUser) {
        const dataSend = { type: 'message-send' };
        const messageToEndpoint = JSON.stringify(dataSend);
        endPointUser.send(messageToEndpoint);
    }
}
function sendTypingStatus({ id, friendId }) {

    const connection = connected[friendId];
    const dataSend = { type: 'type-event', isTyping: users[id].status.isTyping };
    const messageToEndpoint = JSON.stringify(dataSend);
    connection.send(messageToEndpoint);



}

function broadcastOnlineUsers() {
    Object.keys(connected).forEach(id => {
        const connection = connected[id];
        const dataSend = { users, type: 'online-users' };

        const messageToEndpoint = JSON.stringify(dataSend);


        connection.send(messageToEndpoint);
    });


}
function handleClose(id) {

    delete connected[id];
    delete users[id]
    broadcastOnlineUsers();
}

const port = 8008;

server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`);

});




