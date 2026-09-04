import { useEffect, useState } from "react";
import { motion } from "motion/react";
import api from "../services/api";
import { fadeInUp } from "../utils/motionVariants";

const PLAN_LABELS = {
  basic: "Básico — 100€/mes, 10h",
  premium: "Premium — 150€/mes, 13h + videoset",
};

function MembershipCard() {
  const [membership, setMembership] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const res = await api.get("/memberships/me");
        setMembership(res.data);
        setLoadError(false);
      } catch {
        setLoadError(true);
      }
    };
    fetchMembership();
  }, []);

  const handleCancelar = async () => {
    try {
      const res = await api.delete("/memberships/me");
      setMembership(res.data);
      setCancelError(null);
    } catch (error) {
      setCancelError(
        error.response?.data?.message || "No se pudo cancelar la membresía",
      );
    }
  };

  if (loadError || !membership || membership.status === "cancelada") return null;

  const cancelableFrom = new Date(membership.cancelableFrom);
  const canCancel = new Date() >= cancelableFrom;

  return (
    <div style={{ marginBottom: "2rem" }}>
      <p
        style={{
          fontSize: "11px",
          fontWeight: "500",
          color: "#888",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "12px",
        }}
      >
        Tu membresía
      </p>
      <motion.div
        className="lift-card"
        {...fadeInUp}
        style={{
          background: "#ffffff",
          borderRadius: "18px",
          padding: "1.25rem",
          boxShadow: "0 4px 20px rgba(50, 50, 50, 0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "500", color: "#000" }}>
            {PLAN_LABELS[membership.plan]}
          </span>
          <span
            style={{
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "8px",
              fontWeight: "500",
              background: "#EAF3DE",
              color: "#27500A",
            }}
          >
            {membership.status}
          </span>
        </div>
        <p style={{ fontSize: "13px", color: "#666", margin: "0 0 1rem" }}>
          Te quedan <strong>{membership.hoursRemaining}h</strong> este mes.
        </p>
        {cancelError && (
          <p style={{ fontSize: "12px", color: "#e24b4a", margin: "0 0 10px" }}>
            {cancelError}
          </p>
        )}
        <button
          onClick={canCancel ? handleCancelar : undefined}
          disabled={!canCancel}
          className="btn-motion"
          style={{
            padding: "8px 16px",
            background: "#fff",
            color: canCancel ? "#e24b4a" : "#aaa",
            border: `0.5px solid ${canCancel ? "#e24b4a" : "#ccc"}`,
            borderRadius: "18px",
            fontSize: "12px",
            fontWeight: "500",
            cursor: canCancel ? "pointer" : "default",
          }}
        >
          {canCancel
            ? "Cancelar membresía"
            : `Podrás cancelar a partir del ${cancelableFrom.toLocaleDateString("es-ES")}`}
        </button>
      </motion.div>
    </div>
  );
}

export default MembershipCard;
