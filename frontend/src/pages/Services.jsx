import { useState } from "react";
import api from "../services/api";
import podcastPhoto from "../assets/podcast.png";
import grabacionPhoto from "../assets/abdel.jpg";
import equiposDjPhoto from "../assets/notalex.jpg";

const SERVICES = [
  {
    id: "equipos-dj",
    title: "Alquiler de equipos de DJ",
    description:
      "Te ofrecemos el mejor precio del mercado en alquiler de equipos profesionales. Monta fiestas privadas, cumpleaños, o lo que quieras. Tus eventos privados comienzan aquí.",
    icon: "🎧",
    gradient: "linear-gradient(135deg, #E8431A 0%, #F4A020 100%)",
    photo: equiposDjPhoto,
  },
  {
    id: "podcast",
    title: "Alquiler de servicio de podcast",
    description:
      "Te ofrecemos el espacio perfecto y las herramientas adecuadas para que puedas hacer crecer tu proyecto personal. Perfecto para entrevistas y todo tipo de grabaciones en alta calidad. Cotiza aquí.",
    icon: "🎙️",
    gradient: "linear-gradient(135deg, #1B35C6 0%, #185FA5 100%)",
    photo: podcastPhoto,
  },
  {
    id: "grabacion-dj-set",
    title: "Grabación de DJ/Set",
    description:
      "Te ofrecemos el mejor contenido en la mejor calidad. Tendrás contenido de calidad listo para subir a tus redes sociales. Cotiza aquí nuestros precios y disponibilidad.",
    icon: "🎥",
    gradient: "linear-gradient(135deg, #414375 0%, #1d3a5f 100%)",
    photo: grabacionPhoto,
  },
];

function Services() {
  const [activeService, setActiveService] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleCerrarModal = () => {
    setActiveService(null);
    setMessage("");
    setSuccess(false);
    setError(null);
  };

  const handleEnviar = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await api.post("/services/inquiry", {
        service: activeService.title,
        message,
      });
      setSuccess(true);
    } catch (err) {
      setError("No se pudo enviar la solicitud, intenta de nuevo");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        padding: "2rem 1.5rem",
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "20px",
          fontWeight: "500",
          marginBottom: "0.5rem",
          color: "#000000",
        }}
      >
        Servicios adicionales
      </h1>
      <p style={{ fontSize: "13px", color: "#666", marginBottom: "2rem" }}>
        Cada evento es distinto. Cuéntanos qué necesitas y te cotizamos a
        medida.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {SERVICES.map((service) => (
          <div
            key={service.id}
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(50, 50, 50, 0.15)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                background: service.photo ? undefined : service.gradient,
                height: "140px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "44px",
                overflow: "hidden",
              }}
            >
              {service.photo ? (
                <img
                  src={service.photo}
                  alt={service.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                service.icon
              )}
            </div>
            <div
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1B1F24",
                  margin: "0 0 10px",
                }}
              >
                {service.title}
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#666",
                  lineHeight: "1.6",
                  flex: 1,
                  margin: "0 0 1.5rem",
                }}
              >
                {service.description}
              </p>
              <button
                onClick={() => setActiveService(service)}
                style={{
                  padding: "10px",
                  background: "#1B35C6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Estoy interesado
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeService && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "500", color: "#1B1F24" }}>
                {activeService.title}
              </h2>
              <button
                onClick={handleCerrarModal}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#888",
                }}
              >
                ✕
              </button>
            </div>

            {success ? (
              <p style={{ fontSize: "14px", color: "#27500A" }}>
                ¡Listo! Enviamos tu solicitud a Core Studios, te contactaremos
                pronto para cotizarte.
              </p>
            ) : (
              <>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#666",
                    marginBottom: "1rem",
                  }}
                >
                  Cuéntanos qué necesitas: fecha, duración, tipo de evento, o
                  cualquier detalle que nos ayude a cotizarte mejor.
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Escribe los detalles de tu solicitud..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "0.5px solid #ccc",
                    fontSize: "14px",
                    color: "#1B1F24",
                    resize: "none",
                    marginBottom: "1rem",
                  }}
                />
                {error && (
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#e24b4a",
                      margin: "0 0 1rem",
                    }}
                  >
                    {error}
                  </p>
                )}
                <button
                  onClick={handleEnviar}
                  disabled={!message.trim() || sending}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "#1B35C6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: sending ? "default" : "pointer",
                    opacity: sending ? 0.7 : 1,
                  }}
                >
                  {sending ? "Enviando..." : "Enviar solicitud"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;
