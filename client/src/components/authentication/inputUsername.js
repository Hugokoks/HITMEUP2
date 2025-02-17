

export default function InputUsername({ username, setUsername, usernameRef, inputStyle = { marginTop: '40px' }, placeHolder = 'Enter username' }) {

    return (

        <input
            style={inputStyle}
            className='input-authentication'
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            ref={usernameRef} />
    )
}