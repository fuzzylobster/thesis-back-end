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
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    locs: {
      type: DataTypes.ARRAY(DataTypes.JSON)
    },
    cities: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      defaultValue: []
    },
    photoURL: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
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
  };

  return route;
};
