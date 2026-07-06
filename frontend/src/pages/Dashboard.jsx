import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // ── Estados ──────────────────────────────────────
  const [bookings, setBookings] = useState([])
  const [posts, setPosts] = useState([])
  const [slotsDJ, setSlotsDJ] = useState([])
  const [slotsProduccion, setSlotsProduccion] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)
  const [bookingError, setBookingError] = useState(null)
  const [newBooking, setNewBooking] = useState({
    cabinType: 'dj',
    date: '',
    hora: '',
    duracion: '',
    notes: ''
  })

  // ── Carga inicial ─────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const hoy = new Date().toISOString().split('T')[0]
        const [bookingsRes, postsRes, djRes, prodRes] = await Promise.all([
          api.get('/bookings/my'),
          api.get('/posts'),
          api.get(`/bookings/slots?date=${hoy}&cabinType=dj`),
          api.get(`/bookings/slots?date=${hoy}&cabinType=produccion`)
        ])
        setBookings(bookingsRes.data)
        setPosts(postsRes.data.slice(0, 3))
        setSlotsDJ(djRes.data)
        setSlotsProduccion(prodRes.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  // ── Funciones de reservas ─────────────────────────
  const calcularPrecio = () => {
    if (!newBooking.duracion) return 0
    const precios = { 1: 25, 2: 45, 4: 75 }
    return precios[parseInt(newBooking.duracion)] || 0
  }

  const handleCrearReserva = async () => {
    try {
      const start = new Date(`${newBooking.date}T${String(newBooking.hora).padStart(2, '0')}:00:00`)
      const end = new Date(start)
      end.setHours(end.getHours() + parseInt(newBooking.duracion))
      await api.post('/bookings', {
        cabinType: newBooking.cabinType,
        startTime: start,
        endTime: end,
        notes: newBooking.notes,
        price: calcularPrecio()
      })
      setShowModal(false)
      setNewBooking({ cabinType: 'dj', date: '', hora: '', duracion: '', notes: '' })
      setBookingError(null)
      setBookings((await api.get('/bookings/my')).data)
    } catch (error) {
      setBookingError('Ese horario no está disponible, elige otro')
    }
  }

  const handleAbrirEditar = (booking) => {
    setEditingBooking(booking)
    setNewBooking({
      cabinType: booking.cabinType,
      date: new Date(booking.startTime).toISOString().split('T')[0],
      hora: new Date(booking.startTime).getHours(),
      duracion: (new Date(booking.endTime) - new Date(booking.startTime)) / (1000 * 60 * 60),
      notes: booking.notes || ''
    })
    setShowModal(true)
  }

  const handleEditarReserva = async () => {
    try {
      const start = new Date(`${newBooking.date}T${String(newBooking.hora).padStart(2, '0')}:00:00`)
      const end = new Date(start)
      end.setHours(end.getHours() + parseInt(newBooking.duracion))
      await api.put(`/bookings/${editingBooking._id}`, {
        cabinType: newBooking.cabinType,
        startTime: start,
        endTime: end,
        notes: newBooking.notes,
        price: calcularPrecio()
      })
      setShowModal(false)
      setEditingBooking(null)
      setBookings((await api.get('/bookings/my')).data)
    } catch {
      setBookingError('Error al actualizar')
    }
  }

  const handleEliminarReserva = async () => {
    try {
      await api.delete(`/bookings/${editingBooking._id}`)
      setShowModal(false)
      setEditingBooking(null)
      setBookings((await api.get('/bookings/my')).data)
    } catch {
      setBookingError('Error al eliminar')
    }
  }
  return (
    <div style={{ padding: '3rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
  
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '30px', color: '#000000', fontWeight: '500', margin: 0 }}>Bienvenido, {user?.name}</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
  
      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '4rem' }}>
        {[
          { label: 'Reservas activas', value: bookings.filter(b => b.status !== 'cancelada').length, sub: 'Esta semana', desc: 'Reservas confirmadas o pendientes esta semana' },
          { label: 'Horas reservadas', value: `${bookings.length * 2}h`, sub: 'Este mes', desc: 'Total de horas que has usado el estudio este mes' },
          { label: 'Posts publicados', value: posts.length, sub: 'Total', desc: 'Publicaciones que has compartido con la comunidad' },
          { label: 'Likes recibidos', value: posts.reduce((acc, p) => acc + p.likes.length, 0), sub: 'Total', desc: 'Likes que ha recibido tu contenido en total' },
        ].map((m, i) => (
          <div key={i} style={{ background: '#ffffff', borderRadius: '14px', padding: '2rem', position: 'relative', boxShadow: '0 4px 20px rgba(50, 50, 50, 0.2)' }}>
            <div style={{ position: 'absolute', top: '0rem', left: '0rem', background: '#1B35C6', borderRadius: '8px 0px 8px 0px', padding: '8px 20px', fontSize: '12px', color: '#ffffff', fontWeight: '500' }}>
              {m.label}
            </div>
            <div style={{ fontSize: '44px', color: '#1B1F24', fontWeight: '800', marginTop: '2rem', textAlign: 'center' }}>{m.value}</div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '30px', textAlign: 'center' }}>{m.sub}</div>
            <div style={{ borderTop: '1px solid #888', margin: '14px -1.3rem', width: 'calc(50% + 8rem)' }} />
            <div style={{ fontSize: '11px', color: '#888' }}>{m.desc}</div>
          </div>
        ))}
      </div>
  
      {/* Próxima reserva */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
      {bookings.filter(b => new Date(b.startTime) > new Date()).length > 0 && (() => {
        const proxima = bookings
          .filter(b => new Date(b.startTime) > new Date())
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0]
        return (
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '11px', fontWeight: '500', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Tu próxima reserva</p>
            <div style={{ background: '#ffffff', borderRadius: '18px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: '0 4px 20px rgba(50, 50, 50, 0.2)' }}>
              <div style={{ background: '#1B35C6', borderRadius: '10px', padding: '12px 16px', textAlign: 'center', minWidth: '64px' }}>
                <div style={{ fontSize: '22px', fontWeight: '500', color: '#fff', lineHeight: 1 }}>
                  {new Date(proxima.startTime).getDate()}
                </div>
                <div style={{ fontSize: '11px', color: '#fff', marginTop: '2px' }}>
                  {new Date(proxima.startTime).toLocaleDateString('es-ES', { month: 'short' })}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '500', color: '#000000', marginBottom: '4px' }}>
                  Cabina {proxima.cabinType === 'dj' ? 'DJ' : 'de producción'}
                </div>
                <div style={{ fontSize: '13px', color: '#888' }}>
                  {new Date(proxima.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} – {new Date(proxima.endTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', fontWeight: '500', background: proxima.cabinType === 'dj' ? '#EEEDFE' : '#E1F5EE', color: proxima.cabinType === 'dj' ? '#3C3489' : '#085041' }}>
                  {proxima.cabinType === 'dj' ? 'DJ' : 'Producción'}
                </span>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', fontWeight: '500', background: proxima.status === 'confirmada' ? '#EAF3DE' : '#FAEEDA', color: proxima.status === 'confirmada' ? '#27500A' : '#633806' }}>
                  {proxima.status}
                </span>
              </div>
            </div>
          </div>
        )
      })()}
  
      {/* Cabinas disponibles hoy */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '11px', fontWeight: '500', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Cabinas disponibles hoy</p>
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '1rem 1.25rem', boxShadow: '0 4px 20px rgba(50, 50, 50, 0.2)'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '0.5px solid #444' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#1B35C620', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              🎧
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#000000' }}>Cabina DJ</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                {slotsDJ.length === 0 ? 'Disponible ahora' : `${slotsDJ.length} reserva(s) hoy`}
              </div>
            </div>
            <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', fontWeight: '500', background: slotsDJ.length === 0 ? '#EAF3DE' : '#FAEEDA', color: slotsDJ.length === 0 ? '#27500A' : '#633806' }}>
              {slotsDJ.length === 0 ? 'Libre' : 'Ocupada'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#1B35C620', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              🎛️
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#000000' }}>Cabina de producción</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                {slotsProduccion.length === 0 ? 'Disponible ahora' : `${slotsProduccion.length} reserva(s) hoy`}
              </div>
            </div>
            <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', fontWeight: '500', background: slotsProduccion.length === 0 ? '#EAF3DE' : '#FAEEDA', color: slotsProduccion.length === 0 ? '#27500A' : '#633806' }}>
              {slotsProduccion.length === 0 ? 'Libre' : 'Ocupada'}
            </span>
          </div>
        </div>
      </div>
      </div>
  
      {/* Reservas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '13px', fontWeight: '500', color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tus reservas</span>
        <button onClick={() => setShowModal(true)} style={{ fontSize: '13px', color: '#fff', fontWeight: '500', padding: '10px 30px', border: 'none', borderRadius: '18px', background: '#1B35C6', cursor: 'pointer' }}>
          + Nueva
        </button>
      </div>
      <div style={{ background: '#ffffff', borderRadius: '18px', padding: '1rem 1.25rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(50, 50, 50, 0.2)' }}>
        {bookings.length === 0 && <p style={{ fontSize: '13px', color: '#888' }}>No tienes reservas todavía</p>}
        {bookings.slice(0, 3).map(booking => (
          <div key={booking._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '0.5px solid #444' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>
                {new Date(booking.startTime).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                {new Date(booking.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} – {new Date(booking.endTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', fontWeight: '500', background: booking.cabinType === 'dj' ? '#EEEDFE' : '#E1F5EE', color: booking.cabinType === 'dj' ? '#3C3489' : '#085041' }}>
              {booking.cabinType === 'dj' ? 'DJ' : 'Producción'}
            </span>
            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', fontWeight: '500', background: booking.status === 'confirmada' ? '#EAF3DE' : '#FAEEDA', color: booking.status === 'confirmada' ? '#27500A' : '#633806' }}>
              {booking.status}
            </span>
            <span onClick={() => handleAbrirEditar(booking)} style={{ cursor: 'pointer', fontSize: '16px' }}>✏️</span>
          </div>
        ))}
      </div>
  
      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', width: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>{editingBooking ? 'Editar reserva' : 'Nueva reserva'}</h2>
              <button onClick={() => { setShowModal(false); setEditingBooking(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#888' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '4px' }}>Tipo de cabina</label>
                <select value={newBooking.cabinType} onChange={(e) => setNewBooking({ ...newBooking, cabinType: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '0.5px solid #ccc', fontSize: '14px' }}>
                  <option value="dj">DJ — 25€/hora</option>
                  <option value="produccion">Producción — 25€/hora</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '4px' }}>Fecha</label>
                <input type="date" value={newBooking.date} onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '0.5px solid #ccc', fontSize: '14px' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '4px' }}>Hora de inicio</label>
                <select value={newBooking.hora} onChange={(e) => setNewBooking({ ...newBooking, hora: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '0.5px solid #ccc', fontSize: '14px' }}>
                  <option value="">Selecciona hora</option>
                  {Array.from({ length: 14 }, (_, i) => i + 9).map(h => (
                    <option key={h} value={h}>{h}:00</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '4px' }}>Duración</label>
                <select value={newBooking.duracion} onChange={(e) => setNewBooking({ ...newBooking, duracion: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '0.5px solid #ccc', fontSize: '14px' }}>
                  <option value="">Selecciona duración</option>
                  <option value="1">1 hora</option>
                  <option value="2">2 horas</option>
                  <option value="4">4 horas</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '4px' }}>Notas (opcional)</label>
                <textarea value={newBooking.notes} onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })} rows={3} placeholder="Alguna indicación especial..." style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '0.5px solid #ccc', fontSize: '14px', resize: 'none' }} />
              </div>
              {calcularPrecio() > 0 && (
                <div style={{ background: '#E6F1FB', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#185FA5' }}>Precio estimado: </span>
                  <span style={{ fontSize: '18px', fontWeight: '500', color: '#185FA5' }}>{calcularPrecio()}€</span>
                </div>
              )}
              {bookingError && <p style={{ fontSize: '13px', color: '#e24b4a', textAlign: 'center' }}>{bookingError}</p>}
              {editingBooking ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={handleEditarReserva} style={{ padding: '10px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Guardar cambios</button>
                  <button onClick={handleEliminarReserva} style={{ padding: '10px', background: '#fff', color: '#e24b4a', border: '0.5px solid #e24b4a', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Eliminar reserva</button>
                </div>
              ) : (
                <button onClick={handleCrearReserva} style={{ padding: '10px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Confirmar reserva</button>
              )}
            </div>
          </div>
        </div>
      )}
  
    </div>
  )
              }

export default Dashboard;