import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,                   //payload
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,              // secret
    {
      expiresIn: "30d",                  //options
    }
  );
};

export const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
   console.log("🔐 Authorization Header:", authHeader); // Debug line
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).send({ message: 'Invalid Token' });
      req.user = user;
      console.log("✅ Authenticated User:", user);
      next();
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

