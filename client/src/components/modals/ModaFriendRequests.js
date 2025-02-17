import API_URLS from '../../config'
import ModalFriendAction from "./ModalFriendAction";
import FriendList from "../FriendList";
import useGetFetch from "../../hooks/useGetFetch";
import postFetch from '../../functions/postFetch';
import Friend from '../Friend';
import Loading from '../Loading';
import { useState } from 'react';


export default function ModalFriendRequests({ userId, trigger, setTrigger,setFriendRequestsNum }) {
    const [focused, setFocused] = useState(null);
    const [message, setMessage] = useState(null);
    const { data, isPending, error } = useGetFetch(`${API_URLS.GET_FRIEND_REQUESTS}?id=${userId}`, trigger, userId);

    async function handleBtn({ e, action = 'add' }) {
        e.preventDefault();
        if (focused === null) {
            setMessage('please select user!');
            return;
        }
        const { status, message: messageRes } = await postFetch({ url: API_URLS.HANDLE_FRIEND_REQUESTS, data: { ...focused, userId, action }, userId });

        if (status === 'success') {
            setMessage(messageRes);
            setTrigger(value => !value);
            setFriendRequestsNum(value=> value = value-1);
        }
    };

    return (
        <ModalFriendAction
            actionName={'Friend requests'}
            showInput={false}
            spanIcon={'🔔'}
            removeBtn={true}
            handleBtn={handleBtn}
            setMessage={setMessage}
            message={message}
        >
            <FriendList friendListStyle={{ height: '450px', marginTop: '10px', width: '400px', backgroudColor: '#2e2d2d' }}>

                {data?.friendRequests.map(value =>
                    <Friend
                        key={value.id}
                        friendId={value.id}
                        friendStyle={{ height: '100px', width: '360px', gridTemplateRows: '100px', gridTemplateColumns: '120px 220px' }}
                        username={value.username}
                        imgSrc={value.img}
                        focused={focused}
                        handleClick={() => { setFocused({ username: value.username, friendId: value.id }) }}

                    />)}
                {isPending && <Loading size='big' style={{ marginTop: '160px' }} />}
                {data?.friendRequests.length === 0 && !isPending && <p style={{ marginTop: '200px', fontSize: '22px' }}>No friend Requests 📪</p>}

            </FriendList>
        </ModalFriendAction>

    )


}