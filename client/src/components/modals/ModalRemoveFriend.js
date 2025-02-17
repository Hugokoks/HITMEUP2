import ModalFriendAction from "./ModalFriendAction";
import FriendList from "../FriendList";
import Friend from "../Friend";
import API_URLS from "../../config";
import postFetch from "../../functions/postFetch";

import { useEffect, useState } from 'react';


export default function ModalRemoveFriend({ friendListArray, userId, setTrigger }) {
    const [focused, setFocused] = useState(null);
    const [message, setMessage] = useState(null);
    const [queryResults, setQueryResults] = useState(null);

    async function handleBtn({ e }) {
        e.preventDefault();
        if (focused === null) {
            setMessage('please select user!');
        }
        const { status, message: reqMessage } = await postFetch({ url: API_URLS.REMOVE_FRIEND, data: { focused, userId }, userId });
        if (status === 'success') {

            setTrigger(value => !value);
            setQueryResults(prevItems => prevItems.filter(item => item.id !== focused.friendId));
            setMessage(reqMessage);
        }
    }
    function inputOnChange(e) {
        const searchTerm = e.target.value.toLowerCase();
        const inputSearch = friendListArray.filter(item => item.username.toLowerCase().includes(searchTerm));
        setQueryResults(inputSearch);
    }

    useEffect(function () {
        function loadData() {
            setQueryResults(friendListArray);
        }
        loadData();
    }, [])

    return (

        <ModalFriendAction
            handleBtn={handleBtn}
            actionName={'Remove Friend'}
            spanIcon={'❌'}
            friendListStyle={{ height: '360px', marginTop: '0', width: '400px', backgroudColor: '#2e2d2d' }}
            removeBtn={true}
            addBtn={false}
            setMessage={setMessage}
            message={message}
            inputOnChange={inputOnChange}

        >
            <FriendList friendListStyle={{ height: '360px', marginTop: '0', width: '400px', backgroudColor: '#2e2d2d' }}>
                {queryResults?.map(value => <Friend
                    key={value.id}
                    friendId={value.id}
                    friendStyle={{ height: '100px', width: '360px', gridTemplateRows: '100px', gridTemplateColumns: '120px 220px' }}
                    username={value.username}
                    imgSrc={value.img}
                    focused={focused}
                    handleClick={() => { setFocused({ username: value.username, friendId: value.id }) }}

                />)}
                {queryResults?.length === 0 && <p style={{ marginTop: '150px', fontSize: '22px' }}>No friend to remove</p>}
            </FriendList>

        </ModalFriendAction>
    )
}