import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function WhoToFollow({ onFollow }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [actionError, setActionError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get("/follows/suggestions");
        setSuggestions(res.data);
        setLoadError(false);
      } catch (err) {
        console.error(err);
        setLoadError(true);
      }
    };
    fetchSuggestions();
  }, []);

  const handleFollow = async (userId) => {
    try {
      await api.post(`/follows/${userId}`);
      setSuggestions((prev) => prev.filter((u) => u._id !== userId));
      setActionError(null);
      onFollow?.();
    } catch (err) {
      console.error(err);
      setActionError("No se pudo seguir a este usuario, intenta de nuevo");
    }
  };

  return (
    <div className="who-to-follow">
      <h2 className="who-to-follow-title">A quién seguir</h2>
      {actionError && <p className="who-to-follow-empty" style={{ color: "#e24b4a" }}>{actionError}</p>}
      {loadError ? (
        <p className="who-to-follow-empty">No se pudieron cargar las sugerencias</p>
      ) : suggestions.length === 0 ? (
        <p className="who-to-follow-empty">No hay más sugerencias por ahora</p>
      ) : (
        suggestions.map((u) => (
          <div key={u._id} className="follow-card">
            <div
              className="follow-avatar"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/profile/${u._id}`)}
            >
              {u.name?.charAt(0).toUpperCase()}
            </div>
            <div className="follow-info">
              <span
                className="follow-name"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/profile/${u._id}`)}
              >
                {u.name}
              </span>
              {u.bio && <span className="follow-bio">{u.bio}</span>}
            </div>
            <button className="follow-button" onClick={() => handleFollow(u._id)}>
              Seguir
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default WhoToFollow;
