import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function BookingCart() {
  const { token } = useAuth();
  const { items, removeItem } = useCart();
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState(null);

  if (!token) return null;

  const total = items.reduce((sum, i) => sum + i.price, 0);

  const handlePagar = () => {
    setNotice(
      "El pago con tarjeta estará disponible muy pronto — mientras tanto, tus reservas quedan pendientes de confirmación.",
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#1B35C6",
          color: "#fff",
          border: "none",
          fontSize: "22px",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          zIndex: 998,
        }}
      >
        🛒
        {items.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "#e24b4a",
              color: "#fff",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "24px",
            width: "320px",
            maxWidth: "90vw",
            maxHeight: "70vh",
            overflowY: "auto",
            background: "#fff",
            borderRadius: "14px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            padding: "1.25rem",
            fontFamily: "Montserrat, sans-serif",
            zIndex: 998,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#1B1F24" }}>
              Resumen de compra
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#888" }}
            >
              ✕
            </button>
          </div>

          {items.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#888" }}>
              Todavía no has agregado ninguna reserva o membresía.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1rem" }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "12px",
                    padding: "8px",
                    background: "#f5f6f8",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ color: "#1B1F24" }}>{item.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: "500", color: "#1B1F24" }}>{item.price}€</span>
                    <span
                      onClick={() => removeItem(item.id)}
                      style={{ cursor: "pointer", color: "#e24b4a" }}
                    >
                      ✕
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {notice && (
            <p
              style={{
                fontSize: "12px",
                color: "#185FA5",
                background: "#E6F1FB",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "1rem",
              }}
            >
              {notice}
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontSize: "13px", color: "#888" }}>Total</span>
            <span style={{ fontSize: "18px", fontWeight: "600", color: "#1B1F24" }}>{total}€</span>
          </div>
          <button
            onClick={handlePagar}
            disabled={items.length === 0}
            style={{
              width: "100%",
              padding: "10px",
              background: items.length === 0 ? "#ccc" : "#1B35C6",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: items.length === 0 ? "default" : "pointer",
            }}
          >
            Pagar
          </button>
        </div>
      )}
    </>
  );
}

export default BookingCart;
