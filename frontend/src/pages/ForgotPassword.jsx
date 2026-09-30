import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import corestudios from "../assets/corestudios.png";
import cedabbi from "../assets/cedabbi.jpg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError("No se pudo procesar la solicitud, intenta de nuevo");
    } finally {
      setSending(false);
    }
  };

  return (
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
          <h1>Recuperar contraseña</h1>
          {sent ? (
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
              Si ese correo existe en nuestro sistema, te enviamos un link para elegir
              una nueva contraseña. Revisa tu bandeja (y la de spam/promociones).
            </p>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <p style={{ fontSize: "13px", color: "#666", margin: "0 0 4px" }}>
                Escribe tu email y te mandamos un link para restablecer tu contraseña.
              </p>
              <input
                className="auth-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <p className="auth-error">{error}</p>}
              <button className="auth-button" type="submit" disabled={sending}>
                {sending ? "Enviando..." : "Enviar link"}
              </button>
            </form>
          )}
          <p className="auth-switch">
            <Link to="/login">Volver a iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
