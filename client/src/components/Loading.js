import { OrbitProgress } from 'react-loading-indicators';


export default function Loading({ size = 'small', color = '#7E60BF', style = {} }) {

    return (
        <div className='loading-box' style={{ ...style }}>

            <OrbitProgress variant="disc" dense color={color} size={size} text="" textColor="" />


        </div>
    )
}