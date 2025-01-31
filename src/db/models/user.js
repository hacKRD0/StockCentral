'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.StockMapper, { onDelete: 'CASCADE' });
      User.hasMany(models.UserStocks, { onDelete: 'CASCADE' });
      User.hasMany(models.Sector, { onDelete: 'CASCADE' });
      User.hasMany(models.StockMaster, { onDelete: 'CASCADE' });
      User.belongsTo(models.Brokerage, {
        foreignKey: 'defaultBrokerageId',
        as: 'defaultBrokerage',
        onDelete: 'SET NULL', // Or 'CASCADE', based on your requirement
        onUpdate: 'CASCADE',
      });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        get() {
          const role = {
            0: 'User',
            1: 'Admin',
          };
          return role[this.getDataValue('role')];
        },
      },
      defaultBrokerageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Brokerage',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
