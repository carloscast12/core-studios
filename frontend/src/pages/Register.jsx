import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import corestudios from '../assets/corestudios.png'
import cedabbi from '../assets/cedabbi.jpg'
import AuthLanding from '../components/AuthLanding'
import AuthBenefits from '../components/AuthBenefits'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const respuesta = await api.post('/auth/register', { name, email, password })
      login(respuesta.data.user, respuesta.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError('Error al registrarse, comprueba los datos')
    }
  }

  return (
    <>
    <div className="auth-page">
      <div
        className="auth-visual"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(232, 67, 26, 0.60) 0%, rgba(27, 53, 198, 0.82) 100%), url(${cedabbi})`,
        }}
      >
        <div className="auth-visual-brand">
          <span className="auth-visual-welcome">Bienvenido a</span>
          <img src={corestudios} alt="Core Studios" className="auth-visual-logo" />
        </div>
        <p className="auth-visual-tagline">Tu estudio de producción y DJ en Madrid.</p>
      </div>
      <div className="auth-form-side">
        <div className="auth-card">
          <h1>Crear cuenta</h1>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input className="auth-input" type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="auth-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="auth-input" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="auth-error">{error}</p>}
            <button className="auth-button" type="submit">Registrarse</button>
          </form>
          <p className="auth-switch">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
        <AuthBenefits />
      </div>
    </div>
    <AuthLanding />
    </>
  )
}

export default Register
