import { Router } from 'express';
import multer from 'multer';
import verifyToken from '../auth/auth.middleware.js';
import path from 'path';

import uploadPortfolio from '../controllers/portfolio/uploadPortfolio.js';
import getStockReferences from '../controllers/portfolio/getStockReferences.js';
import updateStock from '../controllers/portfolio/updateStock.js';
import deleteStock from '../controllers/portfolio/deleteStock.js';
import getConsolidatedPortfolio from '../controllers/portfolio/getConsolidatedPortfolio.js';
import getStockMaster from '../controllers/portfolio/getStockMaster.js';
import getSectors from '../controllers/portfolio/getSectors.js';
import addSector from '../controllers/portfolio/addSector.js';
import updateSector from '../controllers/portfolio/updateSector.js';
import deleteSector from '../controllers/portfolio/deleteSector.js';
import getBrokerages from '../controllers/portfolio/getBrokerages.js';

// Multer setup: Define storage for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const fileType = /csv/; // Define the file types allowed
    const mimeType = fileType.test(file.mimetype);
    const extname = fileType.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return callback(null, true);
    }
    callback('Only csv files are allowed.');
  },
});

const router = Router();

router.post('/upload', verifyToken, upload.single('file'), uploadPortfolio);

router.get('/stockReferences', verifyToken, getStockReferences);

router.put('/updateStock', verifyToken, updateStock);

router.delete('/deleteStock', verifyToken, deleteStock);

router.get('/all', verifyToken, getConsolidatedPortfolio);

router.get('/stockMaster', verifyToken, getStockMaster);

router.get('/sectors', verifyToken, getSectors);

router.post('/addSector', verifyToken, addSector);

router.put('/updateSector', verifyToken, updateSector);

router.delete('/deleteSector', verifyToken, deleteSector);

router.get('/brokerages', verifyToken, getBrokerages);

export default router;
