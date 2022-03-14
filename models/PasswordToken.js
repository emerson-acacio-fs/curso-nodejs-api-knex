const knex = require("../database/connection");
const User = require("./User");

class PasswordToken {
  async create(email) {
    const user = await User.findByEmail(email);
    if (user) {
      const token = Date.now();
      await knex
        .insert({ user_id: user.id, used: 0, token })
        .table("passwordtokens");
      return { status: true, token };
    } else {
      return { status: false, err: "O e-mail não existe" };
    }
  }
  async validate(token) {
    const result = await knex.select().where({ token }).table("passwordtokens");
    if (result.length) {
      if (result[0].used) {
        return { status: false };
      } else {
        return { status: true, token: result[0] };
      }
    } else {
      return { status: false };
    }
  }
  async setUser(token) {
    await knex.update({ used: 1 }).where({ token }).table("passwordtokens");
  }
}

module.exports = new PasswordToken();
