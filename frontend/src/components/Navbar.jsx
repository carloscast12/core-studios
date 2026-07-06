import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocation } from 'react-router-dom'



function Navbar() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!token) return null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
        <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.5rem', height: '56px',
        borderBottom: 'none', background: '#E8431A',
        fontFamily: 'Montserrat, sans-serif', color: '#F4A020'
        }}>

      {/* Logo */}
      <span onClick={() => navigate('/dashboard')} style={{
        fontWeight: '500', fontSize: '16px', cursor: 'pointer'
      }}>
        Core Studios
      </span>

      {/* Links */}
      <div style={{ display: 'flex', gap: '7rem' }}>
      <span onClick={() => navigate('/dashboard')} style={{
  fontSize: '14px', cursor: 'pointer',
  color: location.pathname === '/dashboard' ? '#fff' : '#ffffff',
  borderBottom: location.pathname === '/dashboard' ? '1px solid #fff' : 'none',
  paddingBottom: '4px'
}}>
  Home
</span>

<span onClick={() => navigate('/social')} style={{
  fontSize: '14px', cursor: 'pointer',
  color: location.pathname === '/social' ? '#fff' : '#ffffff',
  borderBottom: location.pathname === '/social' ? '1px solid #fff' : 'none',
  paddingBottom: '4px'
}}>
  Social
</span>
      </div>

      {/* Avatar + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div onClick={() => navigate('/profile')} style={{
          width: '32px', height: '32px', borderRadius: '50%', background: '#E6F1FB',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: '500', color: '#185FA5', cursor: 'pointer'
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <span onClick={handleLogout} style={{
          fontSize: '13px', color: '#888', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif'
        }}>
          Cerrar sesión
        </span>
      </div>

    </nav>
  )
}

export default Navbar;