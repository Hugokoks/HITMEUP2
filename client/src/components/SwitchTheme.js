

export default function SwitchTheme({ logout }) {

    return (
        <label>
            <input className="toggle-checkbox" type="checkbox" />
            <div className="toggle-slot" style={{ marginRight: logout ? "" : "155px" }}>
                <div className="sun-icon-wrapper">
                    <div className="iconify sun-icon" data-icon="feather-sun" data-inline="false"></div>
                </div>
                <div className="toggle-button"></div>
                <div className="moon-icon-wrapper">
                    <div className="iconify moon-icon" data-icon="feather-moon" data-inline="false"></div>
                </div>
            </div>
        </label>


    )

}