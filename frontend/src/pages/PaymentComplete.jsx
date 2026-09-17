import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";

const MESSAGES = {
  pagado: {
    title: "¡Pago confirmado!",
    text: "Tu compra se procesó correctamente. Ya puedes ver el detalle en tu panel.",
    color: "#27500A",
  },
  fallido: {
    title: "El pago no se completó",
    text: "Stripe reportó un problema con el pago. Puedes intentarlo de nuevo desde el carrito.",
    color: "#8A2E2E",
  },
  pendiente: {
    title: "Pago en proceso",
    text: "Todavía estamos confirmando tu pago con Stripe. Espera unos segundos y revisa tu panel.",
    color: "#185FA5",
  },
  error: {
    title: "No pudimos verificar el pago",
    text: "Ocurrió un error al confirmar el pago. Si el cargo se realizó, contáctanos.",
    color: "#8A2E2E",
  },
};

function PaymentComplete() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref) {
      setStatus("error");
      return;
    }
    api
      .get(`/payments/checkout/${ref}/confirm`)
      .then((res) => setStatus(res.data.status))
      .catch(() => setStatus("error"));
  }, [searchParams]);

  const info = MESSAGES[status];

  return (
    <div
      style={{
        padding: "3rem 1.5rem",
        maxWidth: "480px",
        margin: "0 auto",
        textAlign: "center",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {status === "checking" ? (
        <p style={{ fontSize: "14px", color: "#666" }}>Confirmando tu pago...</p>
      ) : (
        <>
          <h1 style={{ fontSize: "20px", fontWeight: "600", color: info.color, marginBottom: "0.75rem" }}>
            {info.title}
          </h1>
          <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6", marginBottom: "1.5rem" }}>
            {info.text}
          </p>
          <Link
            to="/dashboard"
            className="btn-motion"
            style={{
              display: "inline-block",
              padding: "10px 24px",
              background: "#1B35C6",
              color: "#fff",
              borderRadius: "18px",
              fontSize: "14px",
              fontWeight: "500",
              textDecoration: "none",
            }}
          >
            Ir a mi panel
          </Link>
        </>
      )}
    </div>
  );
}

export default PaymentComplete;
