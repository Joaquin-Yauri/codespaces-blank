import recordModel from '../models/records.js';

const getRecords = (req, res) => {
    try {
        const records = recordModel.getRecords(req.query);

        res.status(200).json({
            message: 'Records retrieved successfully.',
            count: records.length,
            data: records,
            links: [
                {
                    rel: 'self',
                    href: '/api/v1/records'
                }
            ]
        });
    } catch(error) {
        res.status(500).json({
            message: 'Failed to retrieve records',
            error: error.message
        });
    }
};

const getRecordById = (req, res) => {
    try {
        const record = recordModel.getRecordById(req.params.id);

        if(!record) {
            return res.status(404).json({
                message: 'Laptime not found'
            });
        }

        res.status(200).json({
            message: 'Laptime retrieved successfully',
            data: record
        });
    } catch(error) {
        res.status(500).json({
            message: 'Failed to retrieve Laptime',
            error: error.message
        });
    }
};

const createRecord = (req,res) => {  
    try {
        const createdRecord = recordModel.createRecord(req.body);

        res.status(201).json({
            message: 'Record created successfully',
            data: createdRecord
        });
    } catch(error) {
        res.status(500).json({
            message: 'Failed to create record',
            error: error.message
        });
    }
};

export { getRecords, getRecordById, createRecord };