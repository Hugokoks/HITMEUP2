import API_URLS from "../config"

export default function ProfileInfo({ username, userImg, btnChangeImg,friendsNum }) {

    return (
        
        <div className="profileInfo">
            <img 
                src={`${API_URLS.UPLOAD_REPOSITORY_URL}/${userImg === null?'no_profile_img.png':userImg}`} 
                className="img-profilePic" 
                alt={`user-img-${username}`}
                />
            {btnChangeImg}
            <h2>{username}</h2>
            <p>Friends: <span>{friendsNum} 🙋‍♂️</span></p>
        </div>

    )



}