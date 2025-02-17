import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom'
import API_URLS from "../../config";
import postFetch from "../../functions/postFetch";
import Header from "../Header";
import InputPassword from "./inputPassword";
import InputUsername from "./inputUsername";
import FormAuthentication from "./FormAuthentication";
import BoxAuthentication from "./BoxAuthentication";


export default function LogIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const passwordRef = useRef();
    const usernameRef = useRef();
    function reset() {
        passwordRef.current.style.borderColor = '#3e3e3e';
        usernameRef.current.style.borderColor = '#3e3e3e';
    }
    async function handleSumbit(e) {
        e.preventDefault();
        reset();
        setError(null);
        try {
            ///epmty input check
            password === '' && (passwordRef.current.style.borderColor = '#BF181D');
            username === '' && (usernameRef.current.style.borderColor = '#BF181D');
            if (username === '' || password === '') throw new Error('Please fill in the fields');

            if (username.length < 3) {
                usernameRef.current.style.borderColor = '#BF181D';
                throw new Error('username minimum lenght 3 characters');
            }
            ///API POST call
            const { id, token, status, message } = await postFetch({ url: API_URLS.LOGIN_URL, data: { username, password }, setError, setLoading });
            if (status === 'error') throw new Error(message);


            localStorage.setItem('token', token);
            navigate(`/home?id=${id}`);
            setUsername('');
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setPassword('');
        }
    }
    return (
        <>
            <Header logout={false} />
            <BoxAuthentication
                action="Log in"
                actionStyle={{ marginTop: '60px' }}
                loading={loading}
                error={error}
                link="register"
                linkText="don't have account?">
                <FormAuthentication formStyle={{ height: '19rem' }} submitBtnName='Log in' handleSumbit={handleSumbit}>
                    <InputUsername
                        username={username}
                        setUsername={setUsername}
                        usernameRef={usernameRef}
                        inputStyle={{ marginTop: '60px' }}
                    />
                    <InputPassword
                        password={password}
                        passwordRef={passwordRef}
                        setPassword={setPassword}
                    />

                </FormAuthentication>
            </BoxAuthentication >
        </>
    )
}