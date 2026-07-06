import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function Profile() {
  const { user, login, token } = useAuth()
  const [form, setForm] = useState({
    name: '',
    bio: '',
    instagram: '',
    soundcloud: ''
  })
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile')
        setForm({
          name: res.data.name || '',
          bio: res.data.bio || '',
          instagram: res.data.socialLinks?.instagram || '',
          soundcloud: res.data.socialLinks?.soundcloud || ''
        })
      } catch (err) {
        console.error(err)
      }
    }
    fetchProfile()
  }, [])

  const handleGuardar = async () => {
    try {
      const res = await api.put('/users/profile', {
        name: form.name,
        bio: form.bio,
        socialLinks: {
          instagram: form.instagram,
          soundcloud: form.soundcloud
        }
      })
      login({ ...user, name: res.data.name }, token)
      setSuccess('Perfil actualizado correctamente')
      setError(null)
    } catch (err) {
      setError('Error al actualizar el perfil')
      setSuccess(null)
    }
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>

      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%', background: '#E6F1FB',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', fontWeight: '500', color: '#185FA5'
        }}>
          {form.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: '500', fontSize: '16px' }}>{form.name}</p>
          <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{user?.email}</p>
        </div>
      </div>

      {/* Formulario */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '4px' }}>Nombre</label>
          <input type="text" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '0.5px solid #ccc', fontSize: '14px' }} />
        </div>

        <div>
          <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '4px' }}>Bio</label>
          <textarea value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3} placeholder="Cuéntanos algo sobre ti..."
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '0.5px solid #ccc', fontSize: '14px', resize: 'none' }} />
        </div>

        <div>
          <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '4px' }}>Instagram</label>
          <input type="text" value={form.instagram} placeholder="@tuusuario"
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '0.5px solid #ccc', fontSize: '14px' }} />
        </div>

        <div>
          <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '4px' }}>Soundcloud</label>
          <input type="text" value={form.soundcloud} placeholder="URL de tu perfil"
            onChange={(e) => setForm({ ...form, soundcloud: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '0.5px solid #ccc', fontSize: '14px' }} />
        </div>

        {success && <p style={{ fontSize: '13px', color: '#27500A', textAlign: 'center' }}>{success}</p>}
        {error && <p style={{ fontSize: '13px', color: '#e24b4a', textAlign: 'center' }}>{error}</p>}

        <button onClick={handleGuardar} style={{
          padding: '10px', background: '#185FA5', color: '#fff', border: 'none',
          borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer'
        }}>
          Guardar cambios
        </button>
      </div>
    </div>
  )
}

export default Profile;