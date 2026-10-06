import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import NavBar from '../components/layout/NavBar.jsx'
import Home from '../features/home/pages/Home.jsx'
import LoginPage from '../features/auth/pages/LoginPage.jsx'
import RegisterPage from '../features/auth/pages/RegisterPage.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import PublicRoute from './PublicRoute.jsx'
import OAuthCallbackPage from '../features/auth/pages/OAuthCallbackPage.jsx'
import '../App.css'

// El NavBar y los margenes solo aparecen en las pantallas con sesión iniciada
function AppLayout() {
    return (
        <>
            <NavBar />
            <main className="main-content">
                <Outlet />
            </main>
        </>
    )
}

function AppRouter() {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Home />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default AppRouter