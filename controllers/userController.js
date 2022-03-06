const User = require("../models/User");

class UserController {
  async index(req, res) {
    try {
      const result = await User.findAll();
      res.status(200);
      res.json(result);
    } catch (err) {
      res.status(500);
      res.json({ error: err.message });
    }
  }
  async findUser(req, res) {
    try {
      const { id } = req.params;
      if (!isNaN(id)) {
        const result = await User.findById(parseInt(id));
        res.status(200);
        res.json(result);
      } else {
        res.status(400);
        res.json({ error: "O id é inválido" });
      }
    } catch (err) {
      res.status(500);
      res.json({ error: err.message });
    }
  }
  async index(req, res) {
    try {
      const result = await User.findAll();
      res.status(200);
      res.json(result);
      return;
    } catch (err) {
      res.status(500);
      res.json({ error: err.message });
      return;
    }
  }
  async create(req, res) {
    try {
      const { email, name, password } = req.body;

      if (!email || !name || !password) {
        res.status(400);
        res.json({ error: "Existe um dado inválido" });
        return;
      }
      await User.new(email, password, name);
      res.status(200);
      res.send("Tudo ok");
    } catch (err) {
      res.status(500);
      res.json({ error: err.message });
      return;
    }
  }
}

module.exports = new UserController();
