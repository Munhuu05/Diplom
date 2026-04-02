const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: 'Forbidden: No roles available' });
    }

    const hasAccess = req.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasAccess) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }

    return next();
  };
}

module.exports = { authenticate, authorize };
