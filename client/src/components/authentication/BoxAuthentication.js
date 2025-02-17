

import Loading from "../Loading";
import { Link } from 'react-router-dom'

export default function BoxAuthentication({
    children,
    loading,
    error,
    action = 'Sign-Up',
    link = 'login',
    linkText = 'already have account?',
    actionStyle = {}

}) {
    return (
        <div className="authentication-box">
            <h1 style={actionStyle}>{action}</h1>
            {children}
            <p>{linkText} <Link className="link-authentication" to={`/${link}`}>{link}</Link></p>
            {error && <p style={{ color: '#BF181D', marginTop: '20px', fontSize: '20px', fontWeight: 'bold' }} > {error}</p>}
            {loading && <Loading style={{ marginTop: '20px' }} />}
        </div >
    )

}