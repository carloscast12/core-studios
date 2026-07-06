import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

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
    <div>
      <h1>Registro</h1>
      {error && <p>{error}</p>}
      <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>Registrarse</button>
    </div>
  )
}

export default Register