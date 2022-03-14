const knex = require("../database/connection");
const bcrypt = require("bcrypt");

class User {
  async findAll() {
    return await knex.select(["id", "name", "email", "role"]).table("users");
  }
  async findById(id) {
    return await knex
      .select(["id", "name", "email", "role"])
      .where({ id })
      .table("users");
  }
  async findByEmail(email, isPassword = false) {
    const result = await knex
      .select([
        "id",
        "name",
        "email",
        "role",
        ...(isPassword ? ["password"] : []),
      ])
      .where({ email })
      .table("users");
    if (result.length > 0) {
      return result[0];
    } else {
      return undefined;
    }
  }

  async delete(id) {
    // Importante!!!!! Precisa verificar se o usuário existe
    return await knex.delete().where({ id }).table("users");
  }

  async new(email, password, name) {
    const hash = await bcrypt.hash(password, 10);

    const res = await knex
      .insert({ name, email, password: hash, role: 0 })
      .table("users");
  }
  async update(id, email, name, role) {
    const newUser = {};
    if (email) {
      newUser.email = email;
    }
    if (name) {
      newUser.name = name;
    }
    if (role) {
      newUser.role = role;
    }
    await knex.update(newUser).where({ id }).table("users");
  }
  async changePassword(newPassword, id, token) {
    const hash = await bcrypt.hash(newPassword, 10);
    await knex.update({ password: hash }).where({ id }).table("users");
  }
}

module.exports = new User();
