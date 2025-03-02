import userVerify from '../functions/userVerify';
import getFetch from '../functions/getFetch';
import API_URLS from '../config';
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useReducer, useState } from "react";

import BtnChangeImg from "./buttons/BtnChangeImg"
import Header from "./Header";
import Main from "./Main";
import ControlPanel from "./ControlPanel";
import BtnRemoveFriend from './buttons/BtnRemoveFriend';
import BtnRequests from './buttons/BtnRequests';
import BtnAddFried from './buttons/BtnAddFriend';
import InputQuery from "./InputQuery";
import ProfileInfo from "./ProfileInfo";
import FriendList from "./FriendList";
import ModalAddFriend from './modals/ModalAddFriend';
import ModalBox from "./modals/ModalBox"
import ModalRemoveFriend from './modals/ModalRemoveFriend';
import Friend from './Friend';
import ModalFriendRequests from './modals/ModaFriendRequests';
import ModalChat from './modals/ModalChat';

const modalInit = {
    activeModal: null,
};
const modalReducer = (state, action) => {
    switch (action.type) {
        case "addFriend": return {
            activeModal: "modalAddFriend",
        }
        case "removeFriend": return {
            activeModal: "modalRemoveFriend"
        }
        case "friendRequests": return {
            activeModal: "modalFriendRequests",
        }
        case "img": return {
            activeModal: "modalImg",
        }
        case "error": return {
            activeModal: "modalError",
        }
        case "chat": return {
            activeModal: "modalChat",
        }
        case "modalClose": return {
            ...modalInit
        }
        default:
            throw new Error("Action uknow");
    };
};

export default function Home() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();  // Access the URL
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('id');  // Extract the `id` from the URL
    const [{ activeModal }, modalDispatch] = useReducer(modalReducer, modalInit);
    const [pageReady, setPageReady] = useState(false);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [userImg, setUserImg] = useState('');
    const [friendListArray, setFriendListArray] = useState([]);
    const [friendListQuery, setFriendListQuery] = useState([]);
    const [trigger, setTrigger] = useState(false);
    const [focused, setFocused] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [ws, setWs] = useState(null);
    const [newMessageSocket, setNewMessageSocket] = useState(false);
    const [isTypingSocket, setIsTypingSocket] = useState(false);
    const [friendRequestsNum, setFriendRequestsNum] = useState(null);
    const [searchFriend, setSearchFriend] = useState('');

    ///verifying token 
    useEffect(function () {
        const token = localStorage.getItem('token');
        async function fetchUserData() {
            const { status, id, username, img } = await userVerify({ userId });

            if (status === 'error' || id !== userId) navigate('/login');

            setUsername(username);
            setUserImg(img);
            setPageReady(true);
        }
        if (!token) {
            navigate('/login');
        }
        else {
            fetchUserData();
        }

        return () => {
            setPageReady(false);
            window.removeEventListener('load', fetchUserData);
        }
    }, [setUserImg, setUsername, setPageReady, navigate, userId]);

    /////API call for getting friends
    useEffect(function () {

        async function getFriendList() {
            const friendListcall = await getFetch({ url: `${API_URLS.GET_FRIENDLIST}?id=${userId}`, userId });

            setFriendListArray(friendListcall.friendListArray);
            setFriendListQuery(friendListcall.friendListArray);

        }
        getFriendList();

    }, [setFriendListArray, userId, trigger, setTrigger])

    ///API call for getting friendRequest number
    useEffect(function () {
        async function getFriendRequests() {
            const { status, friendRequests } = await getFetch({ url: `${API_URLS.GET_FRIEND_REQUESTS}?id=${userId}`, userId });
            if (status === 'success') {
                setFriendRequestsNum(friendRequests.length);

            }
        }
        getFriendRequests();

    }, [userId]);
    ///useEffect for searching in friendList
    useEffect(function () {
        const frindRes = friendListArray.filter(friend => friend.username.includes(searchFriend));

        setFriendListQuery(frindRes);

    }, [searchFriend, friendListArray, setFriendListQuery])
    ///web socket connection hendling
    useEffect(() => {
        const socket = new WebSocket(`ws://127.0.0.1:8008?username=${username}&id=${userId}&token=${token}`);

        socket.onopen = () => {
            console.log('Connected to webSocket server');
            setWs(socket);
        }
        socket.onmessage = (message) => {
            const parsedMessage = JSON.parse(message.data);
            if (parsedMessage.type === 'online-users') {

                setOnlineUsers(parsedMessage.users);
            };
            if (parsedMessage.type === 'message-send') {
                setNewMessageSocket(value => !value);
            };
            if (parsedMessage.type === 'type-event') {

                setIsTypingSocket(parsedMessage.isTyping);

            };
        }
        socket.onclose = () => {
            console.log("Disconnected");
        }
        return () => socket.close();
    }, [userId, username, setWs, setIsTypingSocket, setNewMessageSocket, setOnlineUsers, token])
    if (pageReady) return (

        <>
            <Header />
            <Main>
                <ProfileInfo
                    username={username}
                    userImg={userImg}
                    btnChangeImg={<BtnChangeImg setError={setError} setUserImg={setUserImg} userId={userId} />}
                    friendsNum={friendListArray.length}
                />
                <ControlPanel>
                    <BtnAddFried modalDispatch={modalDispatch} />
                    <BtnRemoveFriend modalDispatch={modalDispatch} />
                    <InputQuery searchFriend={searchFriend} setSearchFriend={setSearchFriend} />
                    <BtnRequests modalDispatch={modalDispatch} />
                    <p className='request-number'>{friendRequestsNum > 0 ? friendRequestsNum : null}</p>
                </ControlPanel>
                <FriendList >
                    {friendListQuery.map(value =>
                        <Friend
                            username={value.username}
                            friendId={value.id}
                            imgSrc={value.img}
                            key={value.id}
                            handleClick={() => { setFocused({ username: value.username, friendId: value.id, imgSrc: value.img }); modalDispatch({ type: 'chat' }) }}
                            userStatusText={true}
                            lastMessageText={true}
                            onlineUsers={onlineUsers}
                            userId={userId}
                            lastMessageRule={true}
                            ws={ws}
                            newMessageSocket={newMessageSocket}

                        />)
                    }
                </FriendList>
            </Main>
            {activeModal !== null &&
                <ModalBox modalDispatch={modalDispatch}>
                    {activeModal === "modalAddFriend" &&
                        <ModalAddFriend userId={userId} setError={setError} />}
                    {activeModal === "modalRemoveFriend" &&
                        <ModalRemoveFriend userId={userId} setError={setError} friendListArray={friendListArray} setTrigger={setTrigger} />}
                    {activeModal === "modalFriendRequests" &&
                        <ModalFriendRequests userId={userId} setError={setError} trigger={trigger} setTrigger={setTrigger} setFriendRequestsNum={setFriendRequestsNum} />}
                    {activeModal === "modalChat" &&
                        <ModalChat
                            focused={focused}
                            userId={userId}
                            onlineUsers={onlineUsers}
                            ws={ws}
                            newMessageSocket={newMessageSocket}
                            isTypingSocket={isTypingSocket}
                            setIsTypingSocket={setIsTypingSocket} />
                    }

                    {activeModal === "error" && <p>{error}</p>}
                </ModalBox>
            }

        </>
    )
}