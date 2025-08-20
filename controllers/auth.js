const jwt = require("jsonwebtoken");
const { getUserById } = require("./user");

const protect = async (req, res, next) => {
  try {
    // Check if token is there
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token || token === "null") {
      return res.redirect("/signin");
    }

    // Verificaton of token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded.id, decoded.iat
    const { id, iat } = decoded;

    const user = await getUserById(id);

    if (!user) {
      return res.redirect("/signin");
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

const checkForUser = async (req, res, next) => {
  try {
    // Check if token is there
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token || token === "null") {
      return next();
    }

    // Verificaton of token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded.id, decoded.iat
    const { id, iat } = decoded;

    const user = await getUserById(id);

    if (!user) {
      return next();
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  protect,
  checkForUser,
};
