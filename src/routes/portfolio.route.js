import { Router } from 'express';
import multer from 'multer';
import verifyToken from '../auth/auth.middleware.js';
import path from 'path';

import uploadPortfolio from '../controllers/portfolio/uploadPortfolio.js';
import getStockReferences from '../controllers/portfolio/getStockReferences.js';
import updateStock from '../controllers/portfolio/updateStock.js';
import deleteStock from '../controllers/portfolio/deleteStock.js';
import getConsolidatedPortfolio from '../controllers/portfolio/getConsolidatedPortfolio.js';

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

export default router;
