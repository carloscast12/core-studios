import { useEffect, useState } from "react";
import api from "../services/api";

function ProfileStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/users/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };
    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="profile-stats">
        <p style={{ fontSize: "13px", color: "#e24b4a", margin: 0 }}>No se pudieron cargar tus estadísticas</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="profile-stats">
      <div className="profile-stats-item">
        <span className="profile-stats-value">{stats.followers}</span>
        <span className="profile-stats-label">Seguidores</span>
      </div>
      <div className="profile-stats-item">
        <span className="profile-stats-value">{stats.following}</span>
        <span className="profile-stats-label">Seguidos</span>
      </div>
      <div className="profile-stats-item">
        <span className="profile-stats-value">{stats.posts}</span>
        <span className="profile-stats-label">Posts</span>
      </div>
    </div>
  );
}

export default ProfileStats;
