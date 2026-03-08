const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tenés permisos para realizar esta acción' });
    }
    next();
  };
};

const authorizePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'No autenticado' });
    }

    if (req.user.role === 'superadmin') {
      return next();
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));

    if (!hasPermission) {
      return res.status(403).json({ message: 'No tenés permisos para realizar esta acción' });
    }

    next();
  };
};

module.exports = { authorizeRole, authorizePermission };
