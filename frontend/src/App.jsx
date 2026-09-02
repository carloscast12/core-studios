import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import UserProfile from './pages/UserProfile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import GuestRoute from './components/GuestRoute.jsx'
import Navbar from './components/Navbar.jsx'
import Social from './pages/Social.jsx'
import Services from './pages/Services.jsx'
import Membresias from './pages/Membresias.jsx'
import Footer from './components/Footer.jsx'
import BookingCart from './components/BookingCart.jsx'
import { useAuth } from './context/AuthContext.jsx'

function ProfileRedirect() {
  const { user } = useAuth()
  return <Navigate to={`/profile/${user.id}`} replace />
}

function RootRedirect() {
  const { token } = useAuth()
  return <Navigate to={token ? '/dashboard' : '/login'} replace />
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileRedirect /></ProtectedRoute>} />
            <Route path="/profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
            <Route path="/servicios" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/membresias" element={<ProtectedRoute><Membresias /></ProtectedRoute>} />
          </Routes>
        </div>
        <Footer />
        <BookingCart />
      </div>
    </BrowserRouter>
  )
}

export default App;