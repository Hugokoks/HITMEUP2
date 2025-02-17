

export default function InputPassword({ password, setPassword, passwordRef, placeHolder = 'Enter password' }) {

    return (
        <input
            type="password"
            className='input-authentication'
            placeholder={placeHolder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            ref={passwordRef} />
    )

}