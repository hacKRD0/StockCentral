'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockReference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StockReference.hasMany(models.StockMaster, { onDelete: 'CASCADE' });
      StockReference.belongsTo(models.Sector, {
        foreignKey: 'SectorId',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
      StockReference.belongsTo(models.User, { foreignKey: 'UserId' });
    }
  }
  StockReference.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      SectorId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Sector',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'StockReference',
    }
  );
  return StockReference;
};
