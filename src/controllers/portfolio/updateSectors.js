import db from '../../db/models/index.js';

const Sector = db.Sector;

export default async (req, res) => {
  const { userId } = req;
  const { updates } = req.body;

  console.log('updates: ', updates);
  console.log('req.body: ', req.body);
  console.log('req body updates', req.body.updates);

  // Validate that 'updates' is provided and is an array
  if (!updates || !Array.isArray(updates)) {
    return res
      .status(400)
      .json({ success: false, message: "'updates' must be an array." });
  }
  try {
    const updatePromises = updates.map(async (update) => {
      const { sectorId, sectorName } = update;

      if (typeof sectorId !== 'number' || typeof sectorName !== 'string') {
        return {
          status: 'rejected',
          reason: 'Invalid sectorId or sectorName.',
          sectorId,
          sectorName,
        };
      }

      try {
        const sectorExists = await Sector.findOne({
          where: { name: sectorName, UserId: userId },
        });

        if (sectorExists) {
          return {
            status: 'rejected',
            reason: 'SectorName already exists.',
            sectorId,
            sectorName,
          };
        }

        await Sector.update(
          {
            name: sectorName,
            updatedAt: new Date(),
          },
          {
            where: { id: sectorId },
          }
        );

        const updatedSector = await Sector.findByPk(sectorId);
        return { status: 'fulfilled', value: updatedSector };
      } catch (error) {
        console.error('updateSector Error: ', error);
        return {
          status: 'rejected',
          reason: 'Database error occurred.',
          sectorId,
          sectorName,
        };
      }
    });
    const results = await Promise.allSettled(updatePromises);

    const successfulUpdates = results
      .filter(({ status }) => status === 'fulfilled')
      .map(({ value }) => value);

    const failedUpdates = results
      .filter(({ status }) => status === 'rejected')
      .map(({ reason }) => reason);

    return res.status(failedUpdates.length === 0 ? 200 : 207).send({
      success: successfulUpdates.length !== 0,
      message: `${successfulUpdates.length} stock(s) updated successfully.`,
      updatedSectors: successfulUpdates,
      failedUpdates: failedUpdates.length > 0 ? failedUpdates : [],
    });
  } catch (error) {
    console.log('updateSector Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while updating the sector.',
    });
  }
};
