


export default function OnlineStatus({ onlineUsers, friendId }) {
    const userStatus = Object.keys(onlineUsers).includes(friendId) ? 'online' : 'offline';

    return (

        <p className='user-status'><span>{userStatus === 'online' ? '🟩' : '🟥'}</span>{userStatus}</p>

    )

}