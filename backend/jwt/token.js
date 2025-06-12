import jwt from 'jsonwebtoken';


export const generateToken = (user) => {
  console.log("In generateToken function");
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } 
  );
  console.log("Token generated:", token);
  return token;
};


export const verifyToken = (req, res, next) => {
    console.log("In verifyToken function");

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Set full payload (id, email if included)
        console.log("Token verified, user id:", decoded.id);
        next();
    } catch (err) {
        console.error("JWT error:", err.message);
        res.status(401).json({ message: 'Token is invalid or expired' });
    }
};
  