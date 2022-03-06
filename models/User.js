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

  async new(email, password, name) {
    const hash = await bcrypt.hash(password, 10);

    const res = await knex
      .insert({ name, email, password: hash, role: 0 })
      .table("users");
    console.log(res);
  }
}

module.exports = new User();
