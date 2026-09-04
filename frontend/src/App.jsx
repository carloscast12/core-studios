import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
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

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <Routes location={location}>
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
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <AnimatedRoutes />
        </div>
        <Footer />
        <BookingCart />
      </div>
    </BrowserRouter>
  )
}

export default App;