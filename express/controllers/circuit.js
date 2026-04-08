import circuitModel from '../models/circuits.js';

const getCircuits = (req, res) => {
    try {
        const circuits = circuitModel.getCircuits();
        res.status(200).json({
            message: 'Circuits retrieved successfully.',
            count: circuits.length,
            data: circuits
        });
    } catch(error) {
        res.status(500).json({
            message: 'Failed to retrieve circuits',
            error: error.message
        });
    }
};

export { getCircuits };