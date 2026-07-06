import JWT from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "token invalido" });
    }
    const validToken = JWT.verify(token, process.env.JWT_SECRET);
    req.user = validToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "token invalido" });
  }
};
