import { Link } from "react-router-dom";
import fran from "../assets/fran.jpg";
import ascio from "../assets/ascio.jpg";
import dani from "../assets/dani.jpg";
import angello from "../assets/angello.jpg";
import dj from "../assets/dj.svg";
import producir from "../assets/producir.svg";
import calendarIcon from "../assets/calendar.svg";
import socialIcon from "../assets/social.svg";
import servicesIcon from "../assets/services.svg";

const WHO_TO_FOLLOW_MOCK = [
  { initial: "A", name: "Ana", bio: "Productora musical" },
  { initial: "D", name: "Diego", bio: "DJ residente" },
  { initial: "V", name: "Valentina", bio: "Vocalista" },
];

const FEATURES = [
  {
    icon: calendarIcon,
    title: "Reserva tu cabina",
    text: "Cabina de DJ o de producción, cuando la necesites. Elige fecha, hora y duración en minutos.",
    mockup: (
      <div
        style={{
          background: "#ffffff",
          borderRadius: "18px",
          padding: "1rem 1.25rem",
          boxShadow: "0 4px 20px rgba(50, 50, 50, 0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 0",
            borderBottom: "0.5px solid #444",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "#1B35C620",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img src={dj} alt="" style={{ width: "18px", height: "18px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{ fontSize: "13px", fontWeight: "500", color: "#000000" }}
            >
              Cabina DJ
            </div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
              1 reserva(s) hoy
            </div>
          </div>
          <span
            style={{
              fontSize: "11px",
              padding: "3px 10px",
              borderRadius: "6px",
              fontWeight: "500",
              background: "#FAEEDA",
              color: "#633806",
            }}
          >
            Ocupada
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 0",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "#1B35C620",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src={producir}
              alt=""
              style={{ width: "18px", height: "18px" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{ fontSize: "13px", fontWeight: "500", color: "#000000" }}
            >
              Cabina de producción
            </div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
              Disponible ahora
            </div>
          </div>
          <span
            style={{
              fontSize: "11px",
              padding: "3px 10px",
              borderRadius: "6px",
              fontWeight: "500",
              background: "#EAF3DE",
              color: "#27500A",
            }}
          >
            Libre
          </span>
        </div>
      </div>
    ),
  },
  {
    icon: socialIcon,
    title: "Comunidad",
    text: "Sube fotos de tu trabajo, publica posts, comenta y dale like al contenido de otros artistas de la comunidad.",
    mockup: (
      <div className="who-to-follow">
        <h2 className="who-to-follow-title">A quién seguir</h2>
        {WHO_TO_FOLLOW_MOCK.map((u) => (
          <div key={u.name} className="follow-card">
            <div className="follow-avatar">{u.initial}</div>
            <div className="follow-info">
              <span className="follow-name">{u.name}</span>
              <span className="follow-bio">{u.bio}</span>
            </div>
            <span className="follow-button" style={{ cursor: "default" }}>
              Seguir
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: servicesIcon,
    title: "Servicios adicionales",
    text: "Alquiler de equipos, podcast y grabación de tus sets, con cotización a medida para cada evento.",
    mockup: (
      <div
        style={{
          background: "#ffffff",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(50, 50, 50, 0.15)",
        }}
      >
        <div style={{ padding: "1.25rem" }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#1B1F24",
              margin: "0 0 8px",
            }}
          >
            Alquiler de equipos de DJ
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "#666",
              lineHeight: "1.6",
              margin: "0 0 1rem",
            }}
          >
            El mejor precio del mercado en alquiler de equipos profesionales.
          </p>
          <span
            style={{
              display: "block",
              textAlign: "center",
              padding: "10px",
              background: "#1B35C6",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            Estoy interesado
          </span>
        </div>
      </div>
    ),
  },
];

const SERVICES = [
  {
    id: "equipos-dj",
    icon: "🎧",
    photo: ascio,
    title: "Alquiler de equipos de DJ",
    description:
      "El mejor precio del mercado en alquiler de equipos profesionales. Monta fiestas privadas, cumpleaños, o lo que quieras.",
  },
  {
    id: "podcast",
    icon: "🎙️",
    photo: dani,
    title: "Alquiler de servicio de podcast",
    description:
      "El espacio perfecto y las herramientas adecuadas para hacer crecer tu proyecto personal, entrevistas y grabaciones en alta calidad.",
  },
  {
    id: "grabacion-dj-set",
    icon: "🎥",
    photo: angello,
    title: "Grabación de DJ/Set",
    description:
      "El mejor contenido en la mejor calidad, listo para subir a tus redes sociales.",
  },
];

function AuthLanding() {
  return (
    <>
      {/* Qué encontrarás — cards centradas */}
      <section className="landing-section landing-highlight-section">
        <h2 className="landing-section-title">
          Qué encontrarás en Core Studios
        </h2>
        <div className="landing-highlight-cards">
          {FEATURES.map((f) => (
            <div key={f.title} className="landing-highlight-card">
              <img className="landing-highlight-icon" src={f.icon} alt="" />
              <h3 className="landing-highlight-title">{f.title}</h3>
              <p className="landing-highlight-text">{f.text}</p>
              <div className="landing-highlight-mockup">{f.mockup}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Foto separadora */}
      <section className="landing-photo-banner">
        <img src={fran} alt="Sesión en Core Studios" />
        <div className="landing-photo-banner-text">
          <h2 className="landing-photo-banner-title">No estás solo en esto</h2>
          <p className="landing-photo-banner-subtitle">
            Descubre a otros artistas, comparte tu trabajo y haz crecer tu red
            dentro de Core Studios.
          </p>
          <Link
            to="/register"
            className="landing-photo-banner-button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Conoce nuestra red social
          </Link>
        </div>
      </section>

      {/* Servicios adicionales — cards con foto por servicio */}
      <section className="landing-section landing-highlight-section landing-section--alt">
        <h2 className="landing-section-title">Servicios adicionales</h2>
        <p className="landing-section-subtitle">
          Cada evento es distinto. Cuéntanos qué necesitas y te cotizamos a
          medida.
        </p>
        <div className="landing-highlight-cards">
          {SERVICES.map((service) => (
            <div key={service.id} className="landing-highlight-card">
              <div className="landing-services-photo">
                {service.photo ? (
                  <img src={service.photo} alt={service.title} />
                ) : (
                  <span>{service.icon}</span>
                )}
              </div>
              <h3 className="landing-highlight-title">{service.title}</h3>
              <p className="landing-highlight-text">{service.description}</p>
            </div>
          ))}
        </div>
        <p className="landing-cta">
          <Link
            to="/register"
            className="landing-cta-link"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Crea tu cuenta
          </Link>{" "}
          para pedir una cotización.
        </p>
      </section>
    </>
  );
}

export default AuthLanding;
