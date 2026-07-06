function Footer() {
    return (
      <footer style={{
        background: '#1a1a1a',
        borderTop: '0.5px solid #333',
        padding: '2rem 3rem',
        marginTop: '2rem',
        fontFamily: 'Montserrat, sans-serif'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
  
          {/* Logo + nombre */}
          <div>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: '0 0 8px' }}>Core Studios</p>
            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Tu estudio de producción y DJ en Madrid.</p>
          </div>
  
          {/* Redes sociales */}
          <div>
            <p style={{ fontSize: '13px', fontWeight: '500', color: '#888', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Síguenos</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#ccc', textDecoration: 'none' }}>Instagram</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#ccc', textDecoration: 'none' }}>YouTube</a>
            </div>
          </div>
  
          {/* Contacto */}
          <div>
            <p style={{ fontSize: '13px', fontWeight: '500', color: '#888', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Contacto</p>
            <p style={{ fontSize: '13px', color: '#ccc', margin: '0 0 6px' }}>contacto@corestudios.com</p>
            <p style={{ fontSize: '13px', color: '#ccc', margin: 0 }}>Madrid, España</p>
          </div>
  
        </div>
  
        {/* Copyright */}
        <div style={{ borderTop: '0.5px solid #333', marginTop: '2rem', paddingTop: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>© 2026 Core Studios. Todos los derechos reservados.</p>
        </div>
  
      </footer>
    )
  }
  
  export default Footer;