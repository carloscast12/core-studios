import { useState } from "react";
import { useCart } from "../context/CartContext";

const PLANS = [
  {
    id: "basic",
    title: "Básico",
    price: 100,
    gradient: "linear-gradient(135deg, #E8431A 0%, #F4A020 100%)",
    features: ["10 horas de cabina al mes", "Cabina de DJ o de producción", "Permanencia mínima de 3 meses"],
  },
  {
    id: "premium",
    title: "Premium",
    price: 150,
    gradient: "linear-gradient(135deg, #1B35C6 0%, #185FA5 100%)",
    features: [
      "13 horas de cabina al mes",
      "Cabina de DJ o de producción",
      "Videoset de tu sesión incluido",
      "Permanencia mínima de 3 meses",
    ],
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
        }}
      >
        {PLANS.map((plan) => (
          <div
            key={plan.id}
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
                background: plan.gradient,
                padding: "1.75rem",
                color: "#fff",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>
                {plan.title}
              </div>
              <div style={{ fontSize: "30px", fontWeight: "700" }}>
                {plan.price}€<span style={{ fontSize: "14px", fontWeight: "500" }}>/mes</span>
              </div>
            </div>
            <div
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <ul style={{ margin: "0 0 1.5rem", padding: 0, listStyle: "none", flex: 1 }}>
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      lineHeight: "1.8",
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: "#1B35C6" }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleComprar(plan)}
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
                Comprar membresía
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Membresias;
