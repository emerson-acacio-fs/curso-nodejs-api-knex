const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authToken = req.headers["authorization"];
  if (authToken) {
    try {
      const token = authToken.split(" ")[1];
      const decode = jwt.verify(token, "wewewewewwewewewe");
      if (decode.role == 1) {
        next();
      } else {
        res.status(401);
        res.send("Você não é administrador.");
        return;
      }
    } catch (error) {
      res.status(401);
      res.send("Você não está autenticado.");
      return;
    }
  } else {
    res.status(401);
    res.send("Você não está autenticado.");
    return;
  }
};
