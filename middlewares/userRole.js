export const Admin = (req, res, next) => {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied contact Admin please!" });
    }
    next();
  };
  