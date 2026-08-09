import bcryptjs from "bcryptjs";
import JWT from "jsonwebtoken";
import User from "../models/User.js";

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
