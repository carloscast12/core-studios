import { useEffect, useState } from "react";
import api from "../services/api";

const PLAN_LABELS = {
  basic: "Básico — 100€/mes, 10h",
  premium: "Premium — 150€/mes, 13h + videoset",
};

const formatDate = (d) => new Date(d).toLocaleDateString("es-ES");

function AdminMembershipPanel() {
  const [memberships, setMemberships] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("basic");
  const [formError, setFormError] = useState(null);

  const fetchMemberships = async () => {
    try {
      const res = await api.get("/memberships/admin");
      setMemberships(res.data);
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleCrear = async () => {
    if (!email.trim()) return;
    try {
      await api.post("/memberships", { email, plan });
      setEmail("");
      setFormError(null);
      fetchMemberships();
    } catch (error) {
      setFormError(
        error.response?.data?.message || "No se pudo crear la membresía",
      );
    }
  };

  return (
    <div style={{ marginTop: "3rem" }}>
      <p
        style={{
          fontSize: "13px",
          fontWeight: "500",
          color: "#888",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: "1rem",
        }}
      >
        Panel de administrador — Membresías
      </p>

      <div
        style={{
          background: "#ffffff",
          borderRadius: "18px",
          padding: "1.25rem",
          boxShadow: "0 4px 20px rgba(50, 50, 50, 0.2)",
          marginBottom: "1rem",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="email"
          placeholder="Email del cliente"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "0.5px solid #ccc",
            fontSize: "13px",
          }}
        />
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "0.5px solid #ccc",
            fontSize: "13px",
          }}
        >
          <option value="basic">Básico — 100€/10h</option>
          <option value="premium">Premium — 150€/13h + videoset</option>
        </select>
        <button
          onClick={handleCrear}
          style={{
            padding: "8px 20px",
            background: "#1B35C6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Activar membresía
        </button>
      </div>
      {formError && (
        <p style={{ fontSize: "12px", color: "#e24b4a", marginBottom: "1rem" }}>
          {formError}
        </p>
      )}

      {loadError && (
        <p style={{ fontSize: "13px", color: "#e24b4a", marginBottom: "1rem" }}>
          No se pudieron cargar las membresías.
        </p>
      )}

      {memberships.length === 0 && !loadError && (
        <div className="booking-card">
          <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>
            Todavía no hay membresías activas
          </p>
        </div>
      )}

      {memberships.length > 0 && (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            boxShadow: "0 4px 20px rgba(50, 50, 50, 0.2)",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", color: "#1B1F24" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#888", fontSize: "11px", textTransform: "uppercase" }}>
                <th style={{ padding: "14px 16px" }}>Socio</th>
                <th style={{ padding: "14px 16px" }}>Plan</th>
                <th style={{ padding: "14px 16px" }}>Horas usadas / sin usar</th>
                <th style={{ padding: "14px 16px" }}>Inicio</th>
                <th style={{ padding: "14px 16px" }}>Horas se resetean</th>
                <th style={{ padding: "14px 16px" }}>Fin de permanencia</th>
                <th style={{ padding: "14px 16px" }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((m) => (
                <tr key={m._id} style={{ borderTop: "0.5px solid #eee" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: "500", color: "#000" }}>
                      {m.user?.name || "Usuario eliminado"}
                    </div>
                    <div style={{ color: "#888", fontSize: "12px" }}>{m.user?.email}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>{PLAN_LABELS[m.plan]}</td>
                  <td style={{ padding: "14px 16px" }}>
                    {m.hoursUsed}h / {m.hoursRemaining}h
                  </td>
                  <td style={{ padding: "14px 16px" }}>{formatDate(m.startDate)}</td>
                  <td style={{ padding: "14px 16px" }}>{formatDate(m.cycleEndsAt)}</td>
                  <td style={{ padding: "14px 16px" }}>{formatDate(m.cancelableFrom)}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "8px",
                        fontWeight: "500",
                        background: m.status === "activa" ? "#EAF3DE" : "#FBE4E4",
                        color: m.status === "activa" ? "#27500A" : "#8A2E2E",
                      }}
                    >
                      {m.status === "activa" ? "Pagado" : "No pagado"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminMembershipPanel;
