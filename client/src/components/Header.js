import BtnLogout from "./buttons/BtnLogout"
import SwitchTheme from "./SwitchTheme"

export default function Header({ logout = true }) {

    return (

        <div className="header">
            <h1>HITMEUP</h1>

            {/* <SwitchTheme logout={logout} />*/}
            {logout && <BtnLogout />}

        </div>
    )


}