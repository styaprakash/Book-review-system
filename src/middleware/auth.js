const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.header('Authorization');
  if (!header) return res.status(401).json({ message: 'No token provided' });

  const token = header.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
