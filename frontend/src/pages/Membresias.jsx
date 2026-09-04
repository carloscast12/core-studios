import { useState } from "react";
import { motion } from "motion/react";
import { useCart } from "../context/CartContext";
import { fadeInUp, staggerDelay } from "../utils/motionVariants";

const PLANS = [
  {
    id: "basic",
    title: "Básico",
    accent: "#E8431A",
    tagline: "Ideal para empezar y practicar en tus horarios libres.",
    price: 100,
    features: ["10 horas de cabina al mes", "Cabina de DJ o de producción"],
    recommended: false,
  },
  {
    id: "premium",
    title: "Premium",
    accent: "#1B35C6",
    tagline: "Para quienes quieren llevar sus sesiones al siguiente nivel.",
    price: 150,
    features: [
      "13 horas de cabina al mes",
      "Cabina de DJ o de producción",
      "Videoset de tu sesión incluido",
    ],
    recommended: true,
  },
];

function Membresias() {
  const { addItem } = useCart();
  const [notice, setNotice] = useState(null);

  const handleComprar = (plan) => {
    addItem({
      type: "membership",
      label: `Membresía ${plan.title}`,
      price: plan.price,
    });
    setNotice("Se agregó al carrito. Termina el pago desde el carrito flotante para activar tu membresía.");
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
        Membresías
      </h1>
      <p style={{ fontSize: "13px", color: "#666", marginBottom: "2rem" }}>
        Reserva tus horas de cabina cada mes a un precio fijo, sin tener que
        pagar por reserva.
      </p>

      {notice && (
        <p
          style={{
            fontSize: "13px",
            color: "#185FA5",
            background: "#E6F1FB",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "1.5rem",
          }}
        >
          {notice}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            className="lift-card"
            {...fadeInUp}
            {...staggerDelay(i)}
            style={{
              position: "relative",
              background: plan.recommended ? "#F3F5FE" : "#ffffff",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: plan.recommended
                ? "0 8px 28px rgba(27, 53, 198, 0.18)"
                : "0 4px 20px rgba(50, 50, 50, 0.15)",
              border: plan.recommended ? "1.5px solid #1B35C6" : "1px solid #eee",
              display: "flex",
              flexDirection: "column",
              padding: "2rem 1.75rem 1.75rem",
              textAlign: "center",
            }}
          >
            {plan.recommended && (
              <span
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#fff",
                  background: "#1B35C6",
                  padding: "4px 12px",
                  borderRadius: "18px",
                  letterSpacing: "0.02em",
                }}
              >
                Recomendado
              </span>
            )}

            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: plan.accent,
                marginBottom: "14px",
              }}
            >
              {plan.title}
            </div>

            <div style={{ fontSize: "38px", fontWeight: "700", color: "#1B1F24", lineHeight: 1 }}>
              {plan.price}€
            </div>
            <div style={{ fontSize: "12px", color: "#888", margin: "6px 0 14px" }}>
              cada mes
            </div>

            <p style={{ fontSize: "13px", color: "#666", lineHeight: "1.6", margin: "0 0 12px" }}>
              {plan.tagline}
            </p>

            <div style={{ fontSize: "11px", color: "#888", marginBottom: "1.5rem" }}>
              Permanencia mínima de 3 meses
            </div>

            <button
              onClick={() => handleComprar(plan)}
              className="btn-motion"
              style={{
                padding: "10px",
                background: plan.accent,
                color: "#fff",
                border: "none",
                borderRadius: "18px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                marginBottom: "1.5rem",
              }}
            >
              Comprar membresía
            </button>

            <div style={{ borderTop: "0.5px solid #ddd", marginBottom: "1.25rem" }} />

            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {plan.features.map((feature, idx) => (
                <li
                  key={feature}
                  style={{
                    fontSize: "13px",
                    color: "#555",
                    padding: "10px 0",
                    borderTop: idx === 0 ? "none" : "0.5px solid #eee",
                  }}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Membresias;
