import { Router } from 'express';
import verifyToken from '../auth/auth.middleware.js';

import getDefaultBrokerage from '../controllers/user/getDefaultBrokerage.js';
import updateDefaultBrokerage from '../controllers/user/updateDefaultBrokerage.js';

const router = Router();

router.get('/defaultBrokerage', verifyToken, getDefaultBrokerage);

router.put('/defaultBrokerage', verifyToken, updateDefaultBrokerage);

export default router;
