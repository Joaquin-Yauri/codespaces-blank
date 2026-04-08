import express from 'express';
const constructorRouter = express.Router();

import { getConstructors } from '../controllers/constructor.js';

constructorRouter.get('/', getConstructors);
export default constructorRouter;