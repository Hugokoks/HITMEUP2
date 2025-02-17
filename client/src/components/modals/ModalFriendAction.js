import { useEffect } from "react"


//////////////this compoenet is used as bluePrint for modal actions in controll panel 

export default function ModalFriendAction({
    children,
    handleBtn,
    actionName, 
    spanIcon, 
    showInput = true, 
    inputOnChange,
    inputSearch,message,
    setMessage = () =>{},
    addBtn = true,
    removeBtn = false,
    }) {

    useEffect(()=>{
        const timer = setTimeout(() =>{
            setMessage(null);
        },5000)
        return ()=>clearTimeout(timer);
    },[setMessage,message]);


    return (
        <div className="modal-friendAction">

            <h1><span>{spanIcon}</span>{actionName}</h1>
            <form >
                {showInput && <input 
                    className="input-friendAction" 
                    placeholder="Type username..." 
                    value={inputSearch} 
                    onChange={inputOnChange}
                />}
                
                {children}
                <div className="friendAction-btnBox">
                    {addBtn &&<button className="btn btn-submit-friendAction" onClick={(e) => handleBtn({e,action:'add'})}>Add</button>}
                    {removeBtn&&<button className="btn btn-submit-friendAction" onClick={(e)=>handleBtn({e,action:'remove'}) }>remove</button>}
                </div>

            </form>

        {message && <p className="modal-friendAction-message" style={{color:'#7E60BF'}}>{message.message|| message }</p>}
        </div >

    )
}