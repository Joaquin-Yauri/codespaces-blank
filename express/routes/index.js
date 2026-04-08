import express from 'express';
const router = express.Router();

import circuitRouter from './circuit.js';
import recordRouter from './record.js';
import constructorRouter from './constructor.js'

router.use('/circuits', circuitRouter);
router.use('/records', recordRouter);
router.use('/constructors', constructorRouter);

export default router;