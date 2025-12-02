const Joi = require('joi');
const db = require('./mysqlORM');

function unique(table, column) {
  return Joi.any().external(async (value) => {
    const exists = await db(table).where({ [column]: value }).first();
    if (exists) {
      throw new Joi.ValidationError(
        `${column} must be unique`,
        [{
          message: `${column} already exists`,
          path: [column],
          type: 'unique',
          context: { key: column, label: column }
        }],
        value
      );
    }
    return value;
  });
}

function uniqueExcept(table, column, id) {
  return Joi.any().external(async (value) => {
    const exists = await db(table)
      .where(column, value)
      .whereNot('id', id)
      .first();

    if (exists) {
      throw new Joi.ValidationError(
        `${column} must be unique`,
        [{
          message: `${column} already exists`,
          path: [column],
          type: 'unique',
          context: { key: column, label: column }
        }],
        value
      );
    }
    return value;
  });
}

function exists(table, column) {
  return Joi.any().external(async (value) => {
    const found = await db(table).where({ [column]: value }).first();
    if (!found) {
      throw new Joi.ValidationError(
        `${column} must exist`,
        [{
          message: `${column} does not exist`,
          path: [column],
          type: 'exists',
          context: { key: column, label: column }
        }],
        value
      );
    }
    return value;
  });
}

module.exports = {
  unique,
  uniqueExcept,
  exists
};
