import User from "../models/User.js";
import transporter from "../config/mailer.js";

export const sendServiceInquiry = async (req, res) => {
  try {
    const { service, message } = req.body;
    if (!service || !message) {
      return res.status(400).json({ message: "faltan datos de la solicitud" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "tu sesión ya no es válida, vuelve a iniciar sesión" });
    }

    await transporter.sendMail({
      from: `"Core Studios Web" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: user.email,
      subject: `Nueva solicitud: ${service}`,
      text: `Servicio: ${service}\nUsuario: ${user.name} (${user.email})\n\nDetalles:\n${message}`,
    });

    return res.status(200).json({ message: "solicitud enviada correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
