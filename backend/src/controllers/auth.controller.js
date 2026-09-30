import bcryptjs from "bcryptjs";
import crypto from "crypto";
import JWT from "jsonwebtoken";
import User from "../models/User.js";
import transporter from "../config/mailer.js";

const generateToken = (userId, role) => {
  return JWT.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const verifyUser = await User.findOne({ email });
    if (verifyUser) {
      return res.status(400).json({ message: "usuario ya existe" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ 
      token: generateToken(newUser._id, newUser.role),
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(400).json({ message: "usuario no encontrado" });
    }
    const matchedPassword = await bcryptjs.compare(password, findUser.password);
    if (!matchedPassword) {
      return res.status(400).json({ message: "datos incorrectos" });
    }
    return res.status(200).json({
      token: generateToken(findUser.id, findUser.role),
      user: {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role,
        avatar: findUser.avatar
      }
    })
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  return res.status(200).json({ message: "sesión cerrada correctamente" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
      user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60);
      await user.save();

      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: user.email,
        replyTo: process.env.CONTACT_EMAIL,
        subject: "Recupera tu contraseña — Core Studios",
        text: `Hola ${user.name},\n\nUsa este link para elegir una nueva contraseña (válido 1 hora):\n${process.env.FRONTEND_URL}/reset-password?token=${rawToken}\n\nSi no pediste esto, ignora este correo.`,
      });
    }
    return res.status(200).json({
      message: "si el correo existe, te enviamos un link para recuperar tu contraseña",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    if (!token || !password) {
      return res.status(400).json({ message: "faltan datos" });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({ message: "el link es inválido o ya expiró" });
    }
    user.password = await bcryptjs.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return res.status(200).json({ message: "contraseña actualizada correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
