import BtnSendMessage from "../buttons/BtnSendMessage"
import API_URLS from "../../config";
import OnlineStatus from '../OnlineStatus';
import getFetch from "../../functions/getFetch";
import { ThreeDot } from 'react-loading-indicators';

import { useEffect, useState, useRef } from "react";


export default function ModalChat({ focused, userId, onlineUsers, ws, newMessageSocket,isTypingSocket }) {
    const { username: friendUsername, friendId, imgSrc } = focused;
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping,setIsTyping] = useState(false);
    const imgString = imgSrc === null ? `${API_URLS.UPLOAD_REPOSITORY_URL}/no_profile_img.png` : `${API_URLS.UPLOAD_REPOSITORY_URL}/${imgSrc}`;
    const messagesEndRef = useRef();

    function timeFormat(messageTimestamp) {
        const now = new Date();
        const messageDate = new Date(messageTimestamp);
        const isToday =
            now.getDate() === messageDate.getDate() &&
            now.getMonth() === messageDate.getMonth() &&
            now.getFullYear() === messageDate.getFullYear();

        const isYesterday =
            now.getDate() - 1 === messageDate.getDate() &&
            now.getMonth() === messageDate.getMonth() &&
            now.getFullYear() === messageDate.getFullYear();

        const hours = messageDate.getHours().toString().padStart(2, '0');
        const minutes = messageDate.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        if (isToday) {
            return timeString;
        } else if (isYesterday) {
            return `Yesterday ${timeString}`;
        } else {
            return messageDate.toLocaleDateString() + ` ${timeString}`;
        }
    }
    async function handleInputChange(e) {
        const value = e.target.value;
        setChatInput(value);
        
        if(value.length > 0 && !isTyping){
            setIsTyping(true);
            ws.send(JSON.stringify({type:'typing-event',status:{isTyping:true},friendId}));
            

        }
        if(value.length === 0 && isTyping){
            setIsTyping(false);
            ws.send(JSON.stringify({type:'typing-event',status:{isTyping:false},friendId}));

        }
    }
    async function handleSubmit(e) {
        e.preventDefault();

        if (chatInput.length === 0) return;
        const newMessage = { id: userId, friendId: friendId, message: chatInput, status: 'sender', timestamp: new Date() };
        sendMessage({ type: 'text-message', message: chatInput, friendId, friendUsername });
        setMessages(prevItems => [...prevItems, newMessage]);
        setChatInput('');
        
        setIsTyping(false);
        ws.send(JSON.stringify({type:'typing-event',status:{isTyping:false},friendId}));

    };

    function sendMessage({ message, type, friendId }) {

        if (ws && ws.readyState === WebSocket.OPEN) {

            ws.send(JSON.stringify({ type, message, friendId }));
        }

    }
    useEffect(() => {
        async function loadMessages() {
            const { status, data } = await getFetch({ url: `${API_URLS.GET_MESSAGES}?id=${userId}&friendId=${friendId}`, userId });

            if (status === 'success') setMessages(data);

        }
        loadMessages();
    }, [newMessageSocket])


    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    }, [messages,isTypingSocket])


    return (
        <div className="box-modalChat">
            <div className="header-modalChat">
                <img src={imgString} alt={`img-${friendUsername}`} />
                <p className="modalChat-username">{friendUsername}</p>
                <OnlineStatus friendId={friendId} onlineUsers={onlineUsers} />
            </div>

            <div className="chatWindow-modalChat" >
                {messages?.map((value, index) =>

                    <div className={`message-wrap-${value.status}`} key={index}>
                        {value.status === 'sender' &&
                            <span style={{ marginRight: '20px' }}>
                                {timeFormat(value.timestamp)}
                            </span>
                        }
                        <p className={`chat-text chat-text-${value.status}`} key={index}>{value.message}</p>

                        {value.status === 'recipient' &&
                            <span style={{ marginLeft: '20px' }}>
                                {timeFormat(value.timestamp)}
                            </span>
                        }

                    </div>
                )
                    
               }
                {isTypingSocket === true && <div className="loading-typing"><ThreeDot variant="bob" color="#7E60BF" size="small" text="" textColor="" /></div> }


                <div ref={messagesEndRef} />
            </div  >

            <form className="footer-modalChat" onSubmit={handleSubmit} >
                <input className="input-chat" placeholder="Write message..." type="text" value={chatInput} onChange={handleInputChange}/>
                <BtnSendMessage />

            </form>


        </div>

    )


}