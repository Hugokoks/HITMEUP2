import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/authentication/Login';
import Register from './components/authentication/Register';
export default function App() {


    return (

        <BrowserRouter>
            <Routes>
                <Route index element={<Login />} />
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
                <Route path='home' element={<Home />} />
            </Routes>
        </BrowserRouter>

    )

}