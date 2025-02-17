import { useEffect, useState } from 'react';
import API_URLS from '../config';
import OnlineStatus from './OnlineStatus'
import getFetch from '../functions/getFetch';

export default function Friend({
    friendStyle = {},
    username,
    userId,
    friendId,
    imgSrc,
    focused,
    handleClick = () => { },
    userStatusText = false,
    lastMessageText = false,
    onlineUsers = {},
    lastMessageRule = false,
    newMessageSocket
}) {
    const [lastMessage, setLastMessage] = useState('');
    const maxMessageLenght = 75;
    const imgSrcString = imgSrc === null ? `${API_URLS.UPLOAD_REPOSITORY_URL}/no_profile_img.png` : `${API_URLS.UPLOAD_REPOSITORY_URL}/${imgSrc}`;
    useEffect(() => {
        async function getLastMessage() {
            const { status, data, message } = await getFetch({ url: `${API_URLS.GET_LASTMESSAGE}?id=${userId}&friendId=${friendId}`, userId });
            if (status === 'error') setLastMessage(message);
            if (status === 'success') {
                //console.log(data);
                const message = data.message;
                setLastMessage(message.length > maxMessageLenght ? `${message.slice(0, maxMessageLenght)}...` : message);

            }

        }
        if (lastMessageRule) getLastMessage();
    }, [newMessageSocket]);


    return (
        <div className={`friend-box ${focused?.username === username ? 'friend-box-focused' : ''}`} style={friendStyle} onClick={handleClick} >
            <img src={imgSrcString} alt={`friendsUserImg-${username}`} />
            <h3>{username}</h3>
            {userStatusText && <OnlineStatus onlineUsers={onlineUsers} friendId={friendId} />}
            {lastMessageText && <p className='last-message'>{lastMessage}</p>}


        </div>
    )


}