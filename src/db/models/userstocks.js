'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserStocks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserStocks.belongsTo(models.User, {
        foreignKey: 'UserId',
      });
      UserStocks.belongsTo(models.StockMapper, {
        foreignKey: 'StockMapperId',
      });
    }
  }
  UserStocks.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      StockMapperId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      AvgCost: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      Date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize, // Sequelize instance
      modelName: 'UserStocks', // Model name
      indexes: [
        {
          unique: true, // Composite unique index
          fields: ['UserId', 'StockMapperId', 'Date'],
        },
      ],
    }
  );
  return UserStocks;
};
