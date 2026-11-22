
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.admin || !allowedRoles.includes(req.admin.role)) {
            return res.status(403).json({
                message: "Akses ditolak. Kamu tidak memiliki izin."
            });
        }

        next();
    };
};

module.exports = authorizeRole;
