'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sector extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sector.belongsTo(models.User, {
        foreignKey: 'UserId',
        onDelete: 'CASCADE',
      });
      Sector.hasMany(models.StockMaster);
    }
  }
  Sector.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Sector',
    }
  );
  return Sector;
};
