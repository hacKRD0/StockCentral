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
      StockMaster.hasMany(models.StockMapper, { onDelete: 'SET NULL' });
      StockMaster.belongsTo(models.Sector, {
        foreignKey: 'SectorId',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
      StockMaster.belongsTo(models.User, { foreignKey: 'UserId' });
    }
  }
  StockMaster.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      // name: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      SectorId: {
        type: DataTypes.STRING,
        references: {
          model: 'Sector',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'StockMaster',
    }
  );
  return StockMaster;
};
