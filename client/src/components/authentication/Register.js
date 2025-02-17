import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom'
import API_URLS from "../../config";
import postFetch from "../../functions/postFetch";
import Header from "../Header";
import InputPassword from "./inputPassword";
import InputUsername from "./inputUsername";
import FormAuthentication from "./FormAuthentication";
import BoxAuthentication from "./BoxAuthentication";
export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordControll, setPasswordControll] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const passwordRef = useRef();
    const passwordControllRef = useRef();
    const usernameRef = useRef();

    function reset() {
        passwordRef.current.style.borderColor = '#3e3e3e';
        passwordControllRef.current.style.borderColor = '#3e3e3e';
        usernameRef.current.style.borderColor = '#3e3e3e';
    }
    async function handleSumbit(e) {
        e.preventDefault();
        reset();
        setError(null);
        try {
            ///epmty input check
            password === '' && (passwordRef.current.style.borderColor = '#BF181D');
            passwordControll === '' && (passwordControllRef.current.style.borderColor = '#BF181D');
            username === '' && (usernameRef.current.style.borderColor = '#BF181D');
            if (username === '' || password === '' || passwordControll === '') throw new Error('Please fill in the fields');
            ///not same password check
            if (password !== passwordControll) {
                passwordRef.current.style.borderColor = '#BF181D';
                passwordControllRef.current.style.borderColor = '#BF181D';
                throw new Error('Passwords do not match');
            }
            if (username.length < 3) {
                usernameRef.current.style.borderColor = '#BF181D';
                throw new Error('username minimum lenght 3 characters');
            }
            ///API POST call

            const { id, token, status, message } = await postFetch({ url: API_URLS.REGISTER_URL, data: { username, password }, setError, setLoading });

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
            setPasswordControll('');
        }
    }
    return (
        <>
            <Header logout={false} />
            <BoxAuthentication action="Sign-Up" loading={loading} error={error} actionStyle={{ marginTop: '50px' }}>
                <FormAuthentication submitBtnName='Sign-Up' handleSumbit={handleSumbit}>
                    <InputUsername
                        username={username}
                        setUsername={setUsername}
                        usernameRef={usernameRef}
                    />
                    <InputPassword
                        password={password}
                        passwordRef={passwordRef}
                        setPassword={setPassword}
                    />
                    <InputPassword
                        password={passwordControll}
                        passwordRef={passwordControllRef}
                        setPassword={setPasswordControll}
                        placeHolder="Confirm your password" />
                </FormAuthentication>
            </BoxAuthentication >
        </>
    )
}