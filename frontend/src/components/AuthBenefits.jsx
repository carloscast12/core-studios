import check from "../assets/check1.svg";

const BENEFITS = [
  "Reserva tu cabina de DJ o producción online",
  "Conecta con otros artistas de la comunidad",
  "Cotiza servicios adicionales a medida",
];

function AuthBenefits() {
  return (
    <div className="auth-benefits">
      {BENEFITS.map((b) => (
        <div key={b} className="auth-benefit-row">
          <span className="auth-benefit-check">
            <img src={check} alt="" />
          </span>
          <span>{b}</span>
        </div>
      ))}
    </div>
  );
}

export default AuthBenefits;
