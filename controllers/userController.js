const User = require("../models/User");
const bcrypt = require("bcrypt");
const PasswordToken = require("../models/PasswordToken");
const jwt = require("jsonwebtoken");

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
  async remove(req, res) {
    try {
      const { id } = req.params;
      if (!isNaN(id)) {
        await User.delete(id);
        res.status(200);
        res.send("Tudo ok");
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
  async edit(req, res) {
    try {
      const { id, email, name, role } = req.body;
      await User.update(id, email, name, role);
      res.status(200);
      res.send("Tudo ok");
    } catch (err) {
      res.status(500);
      res.json({ error: err.message });
    }
  }
  async recoverPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await PasswordToken.create(email);
      if (result.status) {
        res.status(200);
        res.json({ token: result.token });
      } else {
        res.status(406);
        res.send(result.err);
      }
    } catch (err) {
      res.status(500);
      res.json({ error: err.message });
    }
  }
  async changePassword(req, res) {
    try {
      const { token, password } = req.body;
      const isTokenValid = await PasswordToken.validate(token);
      if (isTokenValid.status) {
        await User.changePassword(
          password,
          isTokenValid.token.user_id,
          isTokenValid.token.token
        );
        await PasswordToken.setUser(token);
        res.status(200);
        res.send("Senha alterada");
      } else {
        res.status(406);
        res.json({ error: "token inválido" });
      }
    } catch (err) {
      res.status(500);
      res.json({ error: err.message });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email, true);
      if (user) {
        const result = await bcrypt.compare(password, user.password);
        if (result) {
          const token = jwt.sign(
            { email, role: user.role },
            "wewewewewwewewewe"
          );
          res.status(200);
          res.json({ token });
        } else {
          res.status(406);
          res.send("Senha incorreta");
        }
      } else {
        res.json({ status: false });
      }
    } catch (err) {
      res.status(500);
      res.json({ error: err.message });
    }
  }
}

module.exports = new UserController();
