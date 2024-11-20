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
      Sector.hasMany(models.StockReference, {
        foreignKey: 'SectorId',
        onUpdate: 'CASCADE',
      });
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
      hooks: {
        /**
         * Before a sector is destroyed, handle the "Unknown" sector logic.
         */
        async beforeDestroy(sector, options) {
          const transaction =
            options.transaction || (await sequelize.transaction());
          const { StockReference, Sector } = sequelize.models;

          try {
            // Find or create the "Unknown" sector
            const [unknownSector] = await Sector.findOrCreate({
              where: {
                name: 'Unknown',
                UserId: sector.UserId, // User who owns the sector
              },
              defaults: {
                name: 'Unknown',
                UserId: sector.UserId,
              },
              transaction,
            });

            // Update stockReferences to reference the "Unknown" sector
            await StockReference.update(
              { SectorId: unknownSector.id },
              { where: { SectorId: sector.id }, transaction }
            );

            if (!options.transaction) {
              await transaction.commit();
            }
          } catch (error) {
            if (!options.transaction) {
              await transaction.rollback();
            }
            throw error;
          }
        },
      },
    }
  );

  return Sector;
};
