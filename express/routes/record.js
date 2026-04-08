import express from 'express';
import { createRecord, getRecordById, getRecords } from '../controllers/record.js';
import validateRecord from '../validators/validateRecord.js'

const recordRouter = express.Router();

recordRouter.get('/', getRecords);
recordRouter.get('/:id', getRecordById);
recordRouter.post('/', validateRecord, createRecord);

export default recordRouter;