import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import corestudios from "../assets/corestudios.png";
import cedabbi from "../assets/cedabbi.jpg";
import PasswordInput from "../components/PasswordInput";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await api.post("/auth/reset-password", { token, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo cambiar la contraseña");
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
          <h1>Elige una nueva contraseña</h1>
          {!token ? (
            <p className="auth-error">Este link no es válido. Solicita uno nuevo.</p>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nueva contraseña"
                required
              />
              {error && <p className="auth-error">{error}</p>}
              <button className="auth-button" type="submit" disabled={sending}>
                {sending ? "Guardando..." : "Guardar contraseña"}
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

export default ResetPassword;
