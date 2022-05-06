import { Routes, Route, Navigate } from 'react-router-dom'

import Layout from './components/Layout/Layout'
import UserProfile from './components/Profile/UserProfile'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import {useContext} from "react"
import AuthContext from "./store/AuthContext"

function App() {
    const context = useContext(AuthContext)
    return (
        <Layout>
            <Routes>
                <Route exact path='/' element={<HomePage />} />
                {!context.isLoggedIn && <Route path='/auth' element={<AuthPage />} />}
                {context.isLoggedIn && <Route path='/profile' element={<UserProfile />} />}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Layout>
    );
}

export default App;