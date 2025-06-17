import jwt from 'jsonwebtoken';
import UserModel from '../model/user.model.js';

// ✅ Generate JWT Token
export const generateToken = (user) => {
  const token = jwt.sign(
    { id: user._id }, // you can also add user.email, etc.
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  return token;
};

// ✅ Middleware to Verify JWT Token
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id).select("-password");


    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.userId = user._id;

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};
