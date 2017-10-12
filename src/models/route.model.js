// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const route = sequelizeClient.define('route', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'createdby'
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  route.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    route.belongsTo(models.users);
    route.belongsToMany(models.location, {through: models.routeslocs});
  };

  return route;
};
