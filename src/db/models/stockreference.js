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
    }
  }
  StockReference.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sector: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'StockReference',
    }
  );
  return StockReference;
};
