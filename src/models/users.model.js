// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const users = sequelizeClient.define('users', {
  googleId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  jwtToken: {
    type: DataTypes.STRING
  },
  badges: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: []
  },
  advCounter: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  miles: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 0
  },
  cities: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
    defaultValue: []
  }
    // email: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   unique: true
    // },
    // password: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
  
  
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  users.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return users;
};
