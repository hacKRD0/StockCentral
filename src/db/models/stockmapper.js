'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockMapper extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StockMapper.belongsTo(models.User, { foreignKey: 'UserId' });
      StockMapper.belongsTo(models.Brokerage, { foreignKey: 'BrokerageId' });
      StockMapper.belongsTo(models.StockMaster, {
        foreignKey: 'StockMasterId',
        onDelete: 'SET NULL',
      });
      StockMapper.hasMany(models.UserStocks, { onDelete: 'CASCADE' });
    }
  }
  StockMapper.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      BrokerageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Brokerage',
          key: 'id',
        },
      },
      StockMasterId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'StockMaster',
          key: 'id',
        },
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
      modelName: 'StockMapper',
    }
  );
  return StockMapper;
};
