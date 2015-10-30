var path = require('path');
var Sequelize = require('sequelize');
require('dotenv').load();

global.__config = require(path.join(__baseDir, 'config'));

var sequelize = new Sequelize(__config.db.name, __config.db.username, __config.db.password, {
  host: __config.db.host,
  port: __config.db.port,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: false
});

global.__db = sequelize;
