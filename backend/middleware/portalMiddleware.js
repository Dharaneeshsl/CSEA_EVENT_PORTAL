export const authorizeYear = (requiredYear) => {
    return (req, res, next) => {
      if (String(req.user.year) !== String(requiredYear)) {
        return res.status(403).json({ message: 'Access denied: Not your year portal' });
      }
      next();
    };
  };
  