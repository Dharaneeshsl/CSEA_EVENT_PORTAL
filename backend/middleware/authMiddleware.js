import jwt from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || '';
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }
  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
export const onlyFirstYears = (req, res, next) => {
  if (req.user?.year === 1) return next();
  return res.status(403).json({ message: 'Access restricted to first-year students' });
};

export const onlySecondYears = (req, res, next) => {
  if (req.user?.year === 2) return next();
  return res.status(403).json({ message: 'Access restricted to second-year students' });
};

export default { verifyToken, onlyFirstYears, onlySecondYears };
