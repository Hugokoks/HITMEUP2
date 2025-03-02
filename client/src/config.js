const urlPort = 4000;

const API_URLS = {
    REGISTER_URL: `http://127.0.0.1:${urlPort}/api/register`,
    VERIFYJWT_URL: `http://127.0.0.1:${urlPort}/api/user_verify`,
    LOGIN_URL: `http://127.0.0.1:${urlPort}/api/login`,
    UPLOAD_URL: `http://127.0.0.1:${urlPort}/api/uploadImg`,
    UPLOAD_REPOSITORY_URL: `http://127.0.0.1:${urlPort}/uploads`,
    ACCOUNT_QUERY_URL: `http://127.0.0.1:${urlPort}/api/accountQuery`,
    ADD_FRIEND_URL: `http://127.0.0.1:${urlPort}/api/addFriend`,
    GET_FRIEND_REQUESTS: `http://127.0.0.1:${urlPort}/api/getFriendRequests`,
    HANDLE_FRIEND_REQUESTS: `http://127.0.0.1:${urlPort}/api/handleFriendRequests`,
    GET_FRIENDLIST: `http://127.0.0.1:${urlPort}/api/getFriendList`,
    REMOVE_FRIEND: `http://127.0.0.1:${urlPort}/api/removeFriend`,
    GET_MESSAGES: `http://127.0.0.1:${urlPort}/api/getMessages`,
    GET_LASTMESSAGE: `http://127.0.0.1:${urlPort}/api/getLastMessage`,
};


export default API_URLS;