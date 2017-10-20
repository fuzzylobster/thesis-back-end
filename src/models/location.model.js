// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const location = sequelizeClient.define('location', {
    name: {
      type: DataTypes.TEXT
    },
    coords: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  location.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    location.belongsToMany(models.route, { through: models.routeslocs });
  };

  return location;
};
