

export default function FormAuthentication({ children, handleSumbit, submitBtnName, formStyle = {} }) {

    return (

        <form style={formStyle} className='authentication-form' name="register">
            {children}

            <button className="btn btn-authentication" style={{ marginTop: "20px" }} onClick={handleSumbit}>{submitBtnName}</button>
        </form>


    )

}