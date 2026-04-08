import express from 'express';
const circuitRouter = express.Router();

import { getCircuits } from '../controllers/circuit.js';

circuitRouter.get('/', getCircuits);
export default circuitRouter;