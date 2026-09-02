import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const PRECIOS = { 1: 25, 2: 45, 4: 75 };

const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "8px",
  border: "0.5px solid #ccc",
  fontSize: "13px",
};

function BookingCart() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [notice, setNotice] = useState(null);
  const [form, setForm] = useState({ cabinType: "dj", date: "", hora: "", duracion: "" });

  if (!token) return null;

  const handleAgregar = () => {
    if (!form.date || !form.hora || !form.duracion) return;
    setItems((prev) => [
      ...prev,
      { id: Date.now(), ...form, price: PRECIOS[parseInt(form.duracion)] || 0 },
    ]);
    setForm({ cabinType: "dj", date: "", hora: "", duracion: "" });
  };

  const handleQuitar = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const total = items.reduce((sum, i) => sum + i.price, 0);

  const handlePagar = () => {
    setNotice(
      "El pago con tarjeta estará disponible muy pronto — mientras tanto, reserva desde tu Dashboard.",
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
              Carrito de reservas
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#888" }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1rem" }}>
            <select
              value={form.cabinType}
              onChange={(e) => setForm({ ...form, cabinType: e.target.value })}
              style={inputStyle}
            >
              <option value="dj">Cabina DJ</option>
              <option value="produccion">Cabina de producción</option>
            </select>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={inputStyle}
            />
            <select
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.target.value })}
              style={inputStyle}
            >
              <option value="">Hora</option>
              {Array.from({ length: 14 }, (_, i) => i + 9).map((h) => (
                <option key={h} value={h}>
                  {h}:00
                </option>
              ))}
            </select>
            <select
              value={form.duracion}
              onChange={(e) => setForm({ ...form, duracion: e.target.value })}
              style={inputStyle}
            >
              <option value="">Duración</option>
              <option value="1">1 hora</option>
              <option value="2">2 horas</option>
              <option value="4">4 horas</option>
            </select>
            <button
              onClick={handleAgregar}
              style={{
                padding: "8px",
                background: "#f5f6f8",
                color: "#1B35C6",
                border: "0.5px solid #1B35C6",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              + Agregar al carrito
            </button>
          </div>

          {items.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#888" }}>Tu carrito está vacío</p>
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
                  <div>
                    <div style={{ fontWeight: "500", color: "#1B1F24" }}>
                      {item.cabinType === "dj" ? "Cabina DJ" : "Cabina de producción"}
                    </div>
                    <div style={{ color: "#888" }}>
                      {item.date} · {item.hora}:00 · {item.duracion}h
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: "500", color: "#1B1F24" }}>{item.price}€</span>
                    <span
                      onClick={() => handleQuitar(item.id)}
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
