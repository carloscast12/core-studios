import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import producir from "../assets/producir.svg";
import dj from "../assets/dj.svg";
import edit from "../assets/edit.svg";

function Dashboard() {
  const { user } = useAuth();

  // ── Estados ──────────────────────────────────────
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ posts: 0, likes: 0 });
  const [slotsDJ, setSlotsDJ] = useState([]);
  const [slotsProduccion, setSlotsProduccion] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [newBooking, setNewBooking] = useState({
    cabinType: "dj",
    date: "",
    hora: "",
    duracion: "",
    notes: "",
  });

  // ── Estados panel de administrador ────────────────
  const [adminBookings, setAdminBookings] = useState([]);
  const [adminDate, setAdminDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [adminError, setAdminError] = useState(null);
  const [adminLoadError, setAdminLoadError] = useState(false);

  // ── Carga inicial ─────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const hoy = new Date().toISOString().split("T")[0];
        const [bookingsRes, statsRes, djRes, prodRes] = await Promise.all([
          api.get("/bookings/my"),
          api.get("/users/stats"),
          api.get(`/bookings/slots?date=${hoy}&cabinType=dj`),
          api.get(`/bookings/slots?date=${hoy}&cabinType=produccion`),
        ]);
        setBookings(bookingsRes.data);
        setStats(statsRes.data);
        setSlotsDJ(djRes.data);
        setSlotsProduccion(prodRes.data);
        setLoadError(false);
      } catch (error) {
        console.error(error);
        setLoadError(true);
      }
    };
    fetchData();
  }, []);

  // ── Carga reservas de todos los usuarios (solo admin) ─
  useEffect(() => {
    if (user?.role !== "admin") return;
    const fetchAdminBookings = async () => {
      try {
        const res = await api.get("/bookings/admin");
        setAdminBookings(res.data);
        setAdminLoadError(false);
      } catch (error) {
        console.error(error);
        setAdminLoadError(true);
      }
    };
    fetchAdminBookings();
  }, [user?.role]);

  // ── Funciones panel de administrador ──────────────
  const handleConfirmarReservaAdmin = async (id) => {
    try {
      await api.put(`/bookings/${id}/status`);
      setAdminBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "confirmada" } : b)),
      );
      setAdminError(null);
    } catch {
      setAdminError("No se pudo confirmar la reserva");
    }
  };

  const handleCancelarReservaAdmin = async (id) => {
    try {
      await api.put(`/bookings/${id}`, { status: "cancelada" });
      setAdminBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelada" } : b)),
      );
      setAdminError(null);
    } catch {
      setAdminError("No se pudo cancelar la reserva");
    }
  };

  const adminBookingsDelDia = adminBookings
    .filter(
      (b) => new Date(b.startTime).toISOString().split("T")[0] === adminDate,
    )
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  // ── Funciones de reservas ─────────────────────────
  const calcularPrecio = () => {
    if (!newBooking.duracion) return 0;
    const precios = { 1: 25, 2: 45, 4: 75 };
    return precios[parseInt(newBooking.duracion)] || 0;
  };

  const handleCrearReserva = async () => {
    try {
      const start = new Date(
        `${newBooking.date}T${String(newBooking.hora).padStart(2, "0")}:00:00`,
      );
      const end = new Date(start);
      end.setHours(end.getHours() + parseInt(newBooking.duracion));
      await api.post("/bookings", {
        cabinType: newBooking.cabinType,
        startTime: start,
        endTime: end,
        notes: newBooking.notes,
        price: calcularPrecio(),
      });
      setShowModal(false);
      setNewBooking({
        cabinType: "dj",
        date: "",
        hora: "",
        duracion: "",
        notes: "",
      });
      setBookingError(null);
      setBookings((await api.get("/bookings/my")).data);
    } catch (error) {
      setBookingError(
        error.response?.data?.message || "No se pudo crear la reserva",
      );
    }
  };

  const handleAbrirEditar = (booking) => {
    setEditingBooking(booking);
    setNewBooking({
      cabinType: booking.cabinType,
      date: new Date(booking.startTime).toISOString().split("T")[0],
      hora: new Date(booking.startTime).getHours(),
      duracion:
        (new Date(booking.endTime) - new Date(booking.startTime)) /
        (1000 * 60 * 60),
      notes: booking.notes || "",
    });
    setShowModal(true);
  };

  const handleEditarReserva = async () => {
    try {
      const start = new Date(
        `${newBooking.date}T${String(newBooking.hora).padStart(2, "0")}:00:00`,
      );
      const end = new Date(start);
      end.setHours(end.getHours() + parseInt(newBooking.duracion));
      await api.put(`/bookings/${editingBooking._id}`, {
        cabinType: newBooking.cabinType,
        startTime: start,
        endTime: end,
        notes: newBooking.notes,
        price: calcularPrecio(),
      });
      setShowModal(false);
      setEditingBooking(null);
      setBookings((await api.get("/bookings/my")).data);
    } catch {
      setBookingError("Error al actualizar");
    }
  };

  const handleEliminarReserva = async () => {
    try {
      await api.delete(`/bookings/${editingBooking._id}`);
      setShowModal(false);
      setEditingBooking(null);
      setBookings((await api.get("/bookings/my")).data);
    } catch {
      setBookingError("Error al eliminar");
    }
  };
  return (
    <div className="dashboard-container">
      {loadError && (
        <p style={{ fontSize: "13px", color: "#e24b4a", marginBottom: "1.5rem" }}>
          No se pudo cargar tu información. Intenta recargar la página.
        </p>
      )}
      {/* Topbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "30px",
              color: "#000000",
              fontWeight: "500",
              margin: 0,
            }}
          >
            Bienvenido, {user?.name}
          </h1>
          <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Métricas */}
      <div className="dashboard-metrics">
        {[
          {
            label: "Reservas activas",
            value: bookings.filter((b) => b.status !== "cancelada").length,
            sub: "Esta semana",
            desc: "Reservas confirmadas o pendientes esta semana",
          },
          {
            label: "Horas reservadas",
            value: `${bookings.length * 2}h`,
            sub: "Este mes",
            desc: "Total de horas que has usado el estudio este mes",
          },
          {
            label: "Posts publicados",
            value: stats.posts,
            sub: "Total",
            desc: "Publicaciones que has compartido con la comunidad",
          },
          {
            label: "Likes recibidos",
            value: stats.likes,
            sub: "Total",
            desc: "Likes que ha recibido tu contenido en total",
          },
        ].map((m, i) => (
          <div key={i} className="metric-card">
            <div
              style={{
                position: "absolute",
                top: "0rem",
                left: "0rem",
                background: "#1B35C6",
                borderRadius: "8px 0px 8px 0px",
                padding: "8px 20px",
                fontSize: "12px",
                color: "#ffffff",
                fontWeight: "500",
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                fontSize: "44px",
                color: "#1B1F24",
                fontWeight: "800",
                marginTop: "2rem",
                textAlign: "center",
              }}
            >
              {m.value}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#888",
                marginTop: "30px",
                textAlign: "center",
              }}
            >
              {m.sub}
            </div>
            <div
              style={{
                borderTop: "1px solid #888",
                margin: "14px -1.3rem",
                width: "calc(100% + 2.6rem)",
              }}
            />
            <div style={{ fontSize: "11px", color: "#888" }}>{m.desc}</div>
          </div>
        ))}
      </div>

      {/* Próxima reserva */}
      <div className="dashboard-row">
        {bookings.filter((b) => new Date(b.startTime) > new Date()).length >
          0 &&
          (() => {
            const proxima = bookings
              .filter((b) => new Date(b.startTime) > new Date())
              .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0];
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
                  Tu próxima reserva
                </p>
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    padding: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    boxShadow: "0 4px 20px rgba(50, 50, 50, 0.2)",
                  }}
                >
                  <div
                    style={{
                      background: "#1B35C6",
                      borderRadius: "10px",
                      padding: "12px 16px",
                      textAlign: "center",
                      minWidth: "64px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: "500",
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {new Date(proxima.startTime).getDate()}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#fff",
                        marginTop: "2px",
                      }}
                    >
                      {new Date(proxima.startTime).toLocaleDateString("es-ES", {
                        month: "short",
                      })}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: "500",
                        color: "#000000",
                        marginBottom: "4px",
                      }}
                    >
                      Cabina{" "}
                      {proxima.cabinType === "dj" ? "DJ" : "de producción"}
                    </div>
                    <div style={{ fontSize: "13px", color: "#888" }}>
                      {new Date(proxima.startTime).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      –{" "}
                      {new Date(proxima.endTime).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "3px 10px",
                        borderRadius: "6px",
                        fontWeight: "500",
                        background:
                          proxima.cabinType === "dj" ? "#EEEDFE" : "#E1F5EE",
                        color:
                          proxima.cabinType === "dj" ? "#3C3489" : "#085041",
                      }}
                    >
                      {proxima.cabinType === "dj" ? "DJ" : "Producción"}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "3px 10px",
                        borderRadius: "6px",
                        fontWeight: "500",
                        background:
                          proxima.status === "confirmada"
                            ? "#EAF3DE"
                            : "#FAEEDA",
                        color:
                          proxima.status === "confirmada"
                            ? "#27500A"
                            : "#633806",
                      }}
                    >
                      {proxima.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

        {/* Cabinas disponibles hoy */}
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
            Cabinas disponibles hoy
          </p>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "1rem 1.25rem",
              boxShadow: "0 4px 20px rgba(50, 50, 50, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 0",
                borderBottom: "0.5px solid #444",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "#1B35C620",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <img
                  src={dj}
                  alt=""
                  style={{ width: "18px", height: "18px" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#000000",
                  }}
                >
                  Cabina DJ
                </div>
                <div
                  style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}
                >
                  {slotsDJ.length === 0
                    ? "Disponible ahora"
                    : `${slotsDJ.length} reserva(s) hoy`}
                </div>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  padding: "3px 10px",
                  borderRadius: "6px",
                  fontWeight: "500",
                  background: slotsDJ.length === 0 ? "#EAF3DE" : "#FAEEDA",
                  color: slotsDJ.length === 0 ? "#27500A" : "#633806",
                }}
              >
                {slotsDJ.length === 0 ? "Libre" : "Ocupada"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 0",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "#1B35C620",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <img
                  src={producir}
                  alt=""
                  style={{ width: "18px", height: "18px" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#000000",
                  }}
                >
                  Cabina de producción
                </div>
                <div
                  style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}
                >
                  {slotsProduccion.length === 0
                    ? "Disponible ahora"
                    : `${slotsProduccion.length} reserva(s) hoy`}
                </div>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  padding: "3px 10px",
                  borderRadius: "6px",
                  fontWeight: "500",
                  background:
                    slotsProduccion.length === 0 ? "#EAF3DE" : "#FAEEDA",
                  color: slotsProduccion.length === 0 ? "#27500A" : "#633806",
                }}
              >
                {slotsProduccion.length === 0 ? "Libre" : "Ocupada"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reservas */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: "500",
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          Tus reservas
        </span>
        <button
          onClick={() => setShowModal(true)}
          style={{
            fontSize: "13px",
            color: "#fff",
            fontWeight: "500",
            padding: "10px 30px",
            border: "none",
            borderRadius: "18px",
            background: "#1B35C6",
            cursor: "pointer",
          }}
        >
          + Nueva
        </button>
      </div>
      <div className="bookings-list">
        {bookings.length === 0 && (
          <div className="booking-card">
            <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>
              No tienes reservas todavía
            </p>
          </div>
        )}
        {bookings.map((booking) => {
          const cabinTitle =
            booking.cabinType === "dj" ? "Cabina DJ" : "Cabina de producción";
          const salaText =
            booking.cabinType === "dj" ? "sala de DJ" : "sala de producción";
          const duracion =
            (new Date(booking.endTime) - new Date(booking.startTime)) /
            (1000 * 60 * 60);
          return (
            <div key={booking._id} className="booking-card">
              <div className="booking-card-header">
                <span className="booking-card-title">{cabinTitle}</span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "8px",
                      fontWeight: "500",
                      background:
                        booking.status === "confirmada" ? "#EAF3DE" : "#FAEEDA",
                      color:
                        booking.status === "confirmada" ? "#27500A" : "#633806",
                    }}
                  >
                    {booking.status}
                  </span>
                  <span
                    onClick={() => handleAbrirEditar(booking)}
                    style={{ cursor: "pointer", fontSize: "16px" }}
                  >
                    <img
                      src={edit}
                      alt=""
                      style={{ width: "24px", height: "24px" }}
                    />
                  </span>
                </div>
              </div>
              <div className="booking-card-time">
                {new Date(booking.startTime).toLocaleDateString("es-ES", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}{" "}
                ·{" "}
                {new Date(booking.startTime).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                –{" "}
                {new Date(booking.endTime).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <p className="booking-card-note">
                ¡Felicidades! Tienes una reserva hecha para la {salaText} por{" "}
                {duracion}h. Si tienes alguna duda, no dudes en contactarnos por
                nuestros canales oficiales.
              </p>
            </div>
          );
        })}
      </div>

      {/* Panel de administrador — reservas de todos los usuarios */}
      {user?.role === "admin" && (
        <div style={{ marginTop: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: "500",
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Panel de administrador — Reservas por día
            </span>
            <input
              type="date"
              value={adminDate}
              onChange={(e) => setAdminDate(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "0.5px solid #ccc",
                fontSize: "13px",
              }}
            />
          </div>

          {adminLoadError && (
            <p style={{ fontSize: "13px", color: "#e24b4a", marginBottom: "1rem" }}>
              No se pudieron cargar las reservas de los usuarios.
            </p>
          )}
          {adminError && (
            <p style={{ fontSize: "13px", color: "#e24b4a", marginBottom: "1rem" }}>
              {adminError}
            </p>
          )}

          <div className="bookings-list">
            {adminBookingsDelDia.length === 0 && !adminLoadError && (
              <div className="booking-card">
                <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>
                  No hay reservas para este día
                </p>
              </div>
            )}
            {adminBookingsDelDia.map((booking) => {
              const cabinTitle =
                booking.cabinType === "dj" ? "Cabina DJ" : "Cabina de producción";
              const statusColors = {
                confirmada: { bg: "#EAF3DE", color: "#27500A" },
                pendiente: { bg: "#FAEEDA", color: "#633806" },
                cancelada: { bg: "#FBE4E4", color: "#8A2E2E" },
              };
              const statusStyle = statusColors[booking.status] || statusColors.pendiente;
              return (
                <div key={booking._id} className="booking-card">
                  <div className="booking-card-header">
                    <span className="booking-card-title">
                      {cabinTitle} — {booking.user?.name || "Usuario eliminado"}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "8px",
                        fontWeight: "500",
                        background: statusStyle.bg,
                        color: statusStyle.color,
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-card-time">
                    {new Date(booking.startTime).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {new Date(booking.endTime).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {booking.notes && (
                    <p className="booking-card-note" style={{ marginBottom: "10px" }}>
                      {booking.notes}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: "8px" }}>
                    {booking.status !== "confirmada" && (
                      <button
                        onClick={() => handleConfirmarReservaAdmin(booking._id)}
                        style={{
                          padding: "8px 16px",
                          background: "#1B35C6",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        Confirmar
                      </button>
                    )}
                    {booking.status !== "cancelada" && (
                      <button
                        onClick={() => handleCancelarReservaAdmin(booking._id)}
                        style={{
                          padding: "8px 16px",
                          background: "#fff",
                          color: "#e24b4a",
                          border: "0.5px solid #e24b4a",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "500" }}>
                {editingBooking ? "Editar reserva" : "Nueva reserva"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingBooking(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#888",
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    color: "#888",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Tipo de cabina
                </label>
                <select
                  value={newBooking.cabinType}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, cabinType: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "0.5px solid #ccc",
                    fontSize: "14px",
                  }}
                >
                  <option value="dj">DJ — 25€/hora</option>
                  <option value="produccion">Producción — 25€/hora</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    color: "#888",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Fecha
                </label>
                <input
                  type="date"
                  value={newBooking.date}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, date: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "0.5px solid #ccc",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    color: "#888",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Hora de inicio
                </label>
                <select
                  value={newBooking.hora}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, hora: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "0.5px solid #ccc",
                    fontSize: "14px",
                  }}
                >
                  <option value="">Selecciona hora</option>
                  {Array.from({ length: 14 }, (_, i) => i + 9).map((h) => (
                    <option key={h} value={h}>
                      {h}:00
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    color: "#888",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Duración
                </label>
                <select
                  value={newBooking.duracion}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, duracion: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "0.5px solid #ccc",
                    fontSize: "14px",
                  }}
                >
                  <option value="">Selecciona duración</option>
                  <option value="1">1 hora</option>
                  <option value="2">2 horas</option>
                  <option value="4">4 horas</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    color: "#888",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Notas (opcional)
                </label>
                <textarea
                  value={newBooking.notes}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, notes: e.target.value })
                  }
                  rows={3}
                  placeholder="Alguna indicación especial..."
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "0.5px solid #ccc",
                    fontSize: "14px",
                    resize: "none",
                  }}
                />
              </div>
              {calcularPrecio() > 0 && (
                <div
                  style={{
                    background: "#E6F1FB",
                    borderRadius: "8px",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#185FA5" }}>
                    Precio estimado:{" "}
                  </span>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "500",
                      color: "#185FA5",
                    }}
                  >
                    {calcularPrecio()}€
                  </span>
                </div>
              )}
              {bookingError && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "#e24b4a",
                    textAlign: "center",
                  }}
                >
                  {bookingError}
                </p>
              )}
              {editingBooking ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={handleEditarReserva}
                    style={{
                      padding: "10px",
                      background: "#185FA5",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Guardar cambios
                  </button>
                  <button
                    onClick={handleEliminarReserva}
                    style={{
                      padding: "10px",
                      background: "#fff",
                      color: "#e24b4a",
                      border: "0.5px solid #e24b4a",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Eliminar reserva
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCrearReserva}
                  style={{
                    padding: "10px",
                    background: "#185FA5",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Confirmar reserva
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
