const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.redirect("/signin");
    }

    if (!req.user.isAdmin) {
      return res.status(403).render("error", { 
        message: "Access denied. Admin privileges required.",
        name: req.user.name 
      });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).render("error", { 
      message: "Internal server error",
      name: req?.user?.name || "" 
    });
  }
};

module.exports = {
  requireAdmin,
};
