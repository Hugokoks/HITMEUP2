


export default function FriendList({ friendListStyle = {}, children }) {


    return (

        <div className='friendList' style={friendListStyle}>
            {children}


        </div>
    )

}