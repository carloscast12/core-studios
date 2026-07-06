import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function Social() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts')
        setPosts(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchPosts()
  }, []);

  const handleCrearPost = async () => {
    try {
      await api.post('/posts', { text: newPost, images: [] })
      setNewPost('')
      setError(null)
      const res = await api.get('/posts')
      setPosts(res.data)
    } catch (err) {
      setError('El post no puede superar los 120 caracteres')
    }
  }
  
  const handleLike = async (postId) => {
    try {
      await api.put(`/posts/${postId}/like`)
      const res = await api.get('/posts')
      setPosts(res.data)
    } catch (err) {
      console.error(err)
    }
  }
  
  const handleEliminarPost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`)
      setPosts(posts.filter(p => p._id !== postId))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'Montserrat, sans-serif' }}>
      
      <h1 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '1.5rem', color: '#fff' }}>Feed</h1>
  
      {/* Crear post */}
      <div style={{ background: '#D1D3D6', borderRadius: '28px', padding: '1rem', marginBottom: '3rem' }}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="¿Qué estás trabajando hoy?"
          rows={1}
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', resize: 'none', fontFamily: 'Montserrat, sans-serif', background: 'transparent', color: '#fff' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <span style={{ fontSize: '12px', color: newPost.length > 120 ? '#e24b4a' : '#666' }}>
            {newPost.length}/120
          </span>
          <button onClick={handleCrearPost} disabled={!newPost.trim() || newPost.length > 120} style={{
            padding: '6px 16px', background: '#0979b0', color: '#fff', border: 'none',
            borderRadius: '18px', fontSize: '13px', fontWeight: '500', cursor: 'pointer',
            
          }}>
            Publicar
          </button>
        </div>
        {error && <p style={{ fontSize: '13px', color: '#e24b4a', margin: '8px 0 0' }}>{error}</p>}
      </div>
  
      {/* Posts */}
      {posts.map(post => (
        <div key={post._id} style={{ background: '#414375', borderRadius: '18px 18px 18px 4px', padding: '1rem', marginBottom: '1rem', maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', background: '#1d3a5f',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '500', color: '#3b82f6', flexShrink: 0
            }}>
              {post.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>{post.user?.name}</span>
              <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                {new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            {post.user?._id === user?.id && (
              <span onClick={() => handleEliminarPost(post._id)} style={{ cursor: 'pointer', fontSize: '16px', color: '#666' }}>🗑️</span>
            )}
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.6', margin: '0 0 10px', color: '#ccc' }}>{post.text}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span onClick={() => handleLike(post._id)} style={{ cursor: 'pointer', fontSize: '16px' }}>
              {post.likes.includes(user?.id) ? '❤️' : '🤍'}
            </span>
            <span style={{ fontSize: '13px', color: '#666' }}>{post.likes.length}</span>
          </div>
        </div>
      ))}
  
    </div>
  )
}

export default Social