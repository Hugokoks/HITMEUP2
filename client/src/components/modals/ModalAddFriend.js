import ModalFriendAction from "./ModalFriendAction";
import API_URLS from "../../config";
import getFetch from '../../functions/getFetch'
import postFetch from '../../functions/postFetch';
import FriendList from "../FriendList";
import Friend from "../Friend";
import { useState } from "react";
export default function ModalAddFriend({ userId }) {
    const [friendList, setFriendList] = useState(null);
    const [inputSearch, setInputSearch] = useState('');
    const [focused, setFocused] = useState(null);
    const [message, setMessage] = useState(null);
    console.log(focused);
    ///adding friend;
    async function handleBtn({ e }) {
        e.preventDefault();
        if (focused === null) {
            setMessage('please select user!');
            return;
        }

        const { status, message } = await postFetch({ url: API_URLS.ADD_FRIEND_URL, data: { ...focused, userId }, userId });
        setFriendList(prevList => prevList.filter(friend => friend.id !== focused.friendId));
        setMessage({ status, message });
        setFocused(null);
    };
    ///typing account name and querying it in database
    async function inputOnChange(e) {
        setInputSearch(e.target.value);
        if (inputSearch.length >= 2) {
            const { status, query } = await getFetch({ url: `${API_URLS.ACCOUNT_QUERY_URL}?username=${inputSearch}&userId=${userId}`, userId });
            if (status === 'success') {
                setFriendList(query);
            }
            if (status === 'error') {
                setFriendList(null);
            }
        }
        else {
            setFriendList(null);
        }

    }
    return (
        <ModalFriendAction
            actionName={'Add Friend'}
            handleBtn={handleBtn}
            spanIcon={'✅'}
            friendListStyle={{ height: '360px', marginTop: '0', width: '400px', backgroudColor: '#2e2d2d' }}
            inputOnChange={inputOnChange}
            inputSearch={inputSearch}
            message={message}
            setMessage={setMessage}
        >
            <FriendList friendListStyle={{ height: '360px', marginTop: '0', width: '400px', backgroudColor: '#2e2d2d' }}>
                {/*Condition for text searching for users */}

                {inputSearch.length <= 2 && <p style={{ marginTop: '150px', fontSize: '22px' }}>search for users 🔎</p>}

                {/*condition for showing found users*/}
                {Array.isArray(friendList) && inputSearch.length > 2 && friendList.map(value =>

                    <Friend
                        key={value.id}
                        friendId={value.id}
                        friendStyle={{ height: '100px', width: '360px', gridTemplateRows: '100px', gridTemplateColumns: '120px 220px' }}
                        username={value.username}
                        imgSrc={value.img}
                        focused={focused}
                        handleClick={() => { setFocused({ username: value.username, friendId: value.id }) }}
                    />)
                }
                {/*condition for no users found*/}
                {!Array.isArray(friendList) && inputSearch.length > 2 && <p style={{ marginTop: '150px', fontSize: '22px' }}>user not found 😞</p>}

            </FriendList>

        </ModalFriendAction>

    )
}