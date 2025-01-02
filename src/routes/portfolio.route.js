import { Router } from 'express';
import multer from 'multer';
import verifyToken from '../auth/auth.middleware.js';
import path from 'path';

import uploadPortfolio from '../controllers/portfolio/uploadPortfolio.js';
import getStockMasters from '../controllers/portfolio/getStockMasters.js';
import updateStockMapper from '../controllers/portfolio/updateStockMapper.js';
import deleteStockMasters from '../controllers/portfolio/deleteStockMasters.js';
import getConsolidatedPortfolio from '../controllers/portfolio/getConsolidatedPortfolio.js';
import getStockMapper from '../controllers/portfolio/getStockMapper.js';
import getSectors from '../controllers/portfolio/getSectors.js';
import addSector from '../controllers/portfolio/addSector.js';
import updateSectors from '../controllers/portfolio/updateSectors.js';
import deleteSectors from '../controllers/portfolio/deleteSectors.js';
import getBrokerages from '../controllers/portfolio/getBrokerages.js';
import updateStockMasters from '../controllers/portfolio/updateStockMasters.js';
import addStockMaster from '../controllers/portfolio/addStockMaster.js';
import getUploadedDates from '../controllers/portfolio/getUploadedDates.js';
import deletePortfolio from '../controllers/portfolio/deletePortfolio.js';

// Define storage for file uploads
const upload = multer({
  dest: 'uploads/', // Destination folder for uploaded files
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, callback) => {
    // Define allowed MIME types
    const allowedMimeTypes = [
      'text/csv',
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    ];

    // Define allowed file extensions
    const allowedExtensions = ['.csv', '.xls', '.xlsx'];

    // Extract file extension from the original file name
    const fileExtension = path.extname(file.originalname).toLowerCase();

    // Check if the MIME type is allowed
    const isMimeTypeAllowed = allowedMimeTypes.includes(file.mimetype);

    // Check if the file extension is allowed
    const isExtensionAllowed = allowedExtensions.includes(fileExtension);

    if (isMimeTypeAllowed && isExtensionAllowed) {
      // File is valid
      return callback(null, true);
    } else {
      // File is invalid
      const error = new Error(
        'Unsupported file type. Please upload a .csv, .xls, or .xlsx file.'
      );
      error.code = 'LIMIT_FILE_TYPES';
      return callback(error, false);
    }
  },
});

const router = Router();

router.post('/upload', verifyToken, upload.single('file'), uploadPortfolio);

router.delete('/', verifyToken, deletePortfolio);

router.get('/stockMasters', verifyToken, getStockMasters);

router.put('/updateStockMapper', verifyToken, updateStockMapper);

router.put('/updateStockMasters', verifyToken, updateStockMasters);

router.delete('/deleteStockMasters', verifyToken, deleteStockMasters);

router.get('/all', verifyToken, getConsolidatedPortfolio);

router.get('/StockMapper', verifyToken, getStockMapper);

router.get('/sectors', verifyToken, getSectors);

router.post('/addSector', verifyToken, addSector);

router.put('/updateSectors', verifyToken, updateSectors);

router.delete('/deleteSectors', verifyToken, deleteSectors);

router.get('/brokerages', verifyToken, getBrokerages);

router.post('/stockMaster', verifyToken, addStockMaster);

router.get('/dates', verifyToken, getUploadedDates);

export default router;
