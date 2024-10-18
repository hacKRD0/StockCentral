'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockMaster extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StockMaster.belongsTo(models.User, { foreignKey: 'UserId' });
      StockMaster.belongsTo(models.Brokerage, { foreignKey: 'BrokerageId' });
      StockMaster.belongsTo(models.StockReference, {
        foreignKey: 'StockReferenceId',
      });
      StockMaster.hasMany(models.UserStocks, { onDelete: 'CASCADE' });
    }
  }
  StockMaster.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      BrokerageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      StockReferenceId: {
        type: DataTypes.INTEGER,
      },
      BrokerageCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      BrokerageSector: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'StockMaster',
    }
  );
  return StockMaster;
};
