import { toScaledHundred, toScaledTen, parseLapTimeToMs } from '../utils/recordConverter.js'

const validateRecord = (req, res, next) => {
    const data = req.body;
    res.locals.errors = [];

    const requiredFields = [
        'circuit_id', 'constructor_id', 'lap_time', 'weather', 'controller_type', 'record_date',
        'front_wing_aero', 'rear_wing_aero', 'on_throttle_differential', 'off_throttle_differential', 'engine_braking', 'front_camber', 'rear_camber', 'front_toe', 'rear_toe',
        'front_suspension', 'rear_suspension', 'front_anti_roll_bar', 'rear_anti_roll_bar', 'front_ride_height', 'rear_ride_height', 'brake_pressure', 'front_brake_bias', 
        'front_left_tyre_pressure', 'front_right_tyre_pressure', 'rear_left_tyre_pressure', 'rear_right_tyre_pressure'
    ];

    const fieldLabels = {
        circuit_id: 'Circuit',
        constructor_id: 'Constructor',
        lap_time: 'Lap Time',
        weather: 'Weather',
        controller_type: 'Controller Type',
        record_date: 'Record Date',
        front_wing_aero: 'Front Wing Aero',
        rear_wing_aero: 'Rear Wing Aero',
        on_throttle_differential: 'On Throttle Differential',
        off_throttle_differential: 'Off Throttle Differential',
        engine_braking: 'Engine Braking',
        front_camber: 'Front Camber',
        rear_camber: 'Rear Camber',
        front_toe: 'Front Toe',
        rear_toe: 'Rear Toe',
        front_suspension: 'Front Suspension',
        rear_suspension: 'Rear Suspension',
        front_anti_roll_bar: 'Front Anti-Roll Bar',
        rear_anti_roll_bar: 'Rear Anti-Roll Bar',
        front_ride_height: 'Front Ride Height',
        rear_ride_height: 'Rear Ride Height',
        brake_pressure: 'Brake Pressure',
        front_brake_bias: 'Front Brake Bias',
        front_left_tyre_pressure: 'Front Left Tyre Pressure',
        front_right_tyre_pressure: 'Front Right Tyre Pressure',
        rear_left_tyre_pressure: 'Rear Left Tyre Pressure',
        rear_right_tyre_pressure: 'Rear Right Tyre Pressure'
    };

    const missingFields = new Set();
    for(const field of requiredFields) {
        if(data[field] == undefined || data[field] === '' || data[field] === null) {
            missingFields.add(field);
            res.locals.errors.push({
                field: fieldLabels[field],
                message: 'This field is required'
            });
        }
    };

    let laptimeMs = NaN;
    if(!missingFields.has('lap_time')) {
        laptimeMs = parseLapTimeToMs(data.lap_time);
        if(!Number.isInteger(laptimeMs) || laptimeMs <= 0) {
            res.locals.errors.push({
                field: fieldLabels['lap_time'],
                message: 'Please use M:SS.mmm format, e.g. 1:30.371'
            });
        };
    };

    let circuitId = NaN
    if(!missingFields.has('circuit_id')) {
        circuitId = Number(data.circuit_id)
        if(!Number.isInteger(circuitId) || circuitId <= 0) {
            res.locals.errors.push({
                field: fieldLabels['circuit_id'],
                message: 'Please select a valid circuit.'
            });
        };
    }

    let constructorId = NaN;
    if(!missingFields.has('constructor_id')) {
        constructorId = Number(data.constructor_id)
        if(!Number.isInteger(constructorId) || constructorId <= 0) {
            res.locals.errors.push({
                field: fieldLabels['constructor_id'],
                message: 'Please select a valid constructor.'
            });
        };
    }

    if(!missingFields.has('weather') && !['Dry', 'Wet'].includes(data.weather)) {
        res.locals.errors.push({
            field: fieldLabels['weather'],
            message: 'Please select "Dry" or "Wet".'
        });
    };

    if(!missingFields.has('controller_type') && !['Controller', 'Wheel'].includes(data.controller_type)) {
        res.locals.errors.push({
            field: fieldLabels['controller_type'],
            message: 'Please select "Controller" or "Wheel".'
        });
    };

    if(!missingFields.has('record_date') && !/^\d{4}-\d{2}-\d{2}$/.test(data.record_date)) {
        res.locals.errors.push({
            field: fieldLabels['record_date'],
            message: 'Please use YYYY-MM-DD format.'
        });
    };

    const cleanData = {
        circuit_id: circuitId,
        constructor_id: constructorId,
        lap_time_ms: laptimeMs,
        weather: data.weather,
        controller_type: data.controller_type,
        record_date: data.record_date,

        front_wing_aero: Number(data.front_wing_aero),
        rear_wing_aero: Number(data.rear_wing_aero),
        on_throttle_differential: Number(data.on_throttle_differential),
        off_throttle_differential: Number(data.off_throttle_differential),
        engine_braking: Number(data.engine_braking),
        
        front_camber: toScaledHundred(data.front_camber),
        rear_camber: toScaledHundred(data.rear_camber),
        front_toe: toScaledHundred(data.front_toe),
        rear_toe: toScaledHundred(data.rear_toe),

        front_suspension: Number(data.front_suspension),
        rear_suspension: Number(data.rear_suspension),
        front_anti_roll_bar: Number(data.front_anti_roll_bar),
        rear_anti_roll_bar: Number(data.rear_anti_roll_bar),
        front_ride_height: Number(data.front_ride_height),
        rear_ride_height: Number(data.rear_ride_height),
        brake_pressure: Number(data.brake_pressure),
        front_brake_bias: Number(data.front_brake_bias),

        front_left_tyre_pressure: toScaledTen(data.front_left_tyre_pressure),
        front_right_tyre_pressure: toScaledTen(data.front_right_tyre_pressure),
        rear_left_tyre_pressure: toScaledTen(data.rear_left_tyre_pressure),
        rear_right_tyre_pressure: toScaledTen(data.rear_right_tyre_pressure)
    };

    const validator = [
        ['front_wing_aero', cleanData.front_wing_aero, 0, 50, 0, 50],
        ['rear_wing_aero', cleanData.rear_wing_aero, 0, 50, 0, 50],
        ['front_suspension', cleanData.front_suspension, 1, 41, 1, 41],
        ['rear_suspension', cleanData.rear_suspension, 1, 41, 1, 41],
        ['front_anti_roll_bar', cleanData.front_anti_roll_bar, 1, 21, 1, 21],
        ['rear_anti_roll_bar', cleanData.rear_anti_roll_bar, 1, 21, 1, 21],
        ['front_ride_height', cleanData.front_ride_height, 10, 40, 10, 40],
        ['rear_ride_height', cleanData.rear_ride_height, 40, 100, 40, 100],
        ['brake_pressure', cleanData.brake_pressure, 80, 100, 80, 100],
        ['front_brake_bias', cleanData.front_brake_bias, 50, 70, 50, 70], 
    ];

    for(const [field, value, min, max, real_min, real_max] of validator) {
        if(missingFields.has(field)) continue;
        if(!Number.isInteger(value) || value < min || value > max) {
            res.locals.errors.push({
                field: field,
                message: `Invalid value for ${fieldLabels[field]}. Please provide an integer between ${real_min} and ${real_max}.`
            });
        }
    };

    const validatorWithSteps = [
        ['on_throttle_differential', cleanData.on_throttle_differential, 10, 100, 5, 10, 100, 5],
        ['off_throttle_differential', cleanData.off_throttle_differential, 10, 100, 5, 10, 100, 5],
        ['engine_braking', cleanData.engine_braking, 0, 100, 10, 0, 100, 10],
        ['front_camber', cleanData.front_camber, -350, -250, 10, -3.5, -2.5, 0.10],
        ['rear_camber', cleanData.rear_camber, -220, -70, 10, -2.2, -0.7, 0.10],
        ['front_toe', cleanData.front_toe, 0, 50, 1, 0.00, 0.50, 0.01],
        ['rear_toe', cleanData.rear_toe, 0, 50, 1, 0.00, 0.50, 0.01],
        ['front_left_tyre_pressure', cleanData.front_left_tyre_pressure, 225, 295, 1, 22.5, 29.5, 0.1],
        ['front_right_tyre_pressure', cleanData.front_right_tyre_pressure, 225, 295, 1, 22.5, 29.5, 0.1],
        ['rear_left_tyre_pressure', cleanData.rear_left_tyre_pressure, 205, 265, 1, 20.5, 26.5, 0.1],
        ['rear_right_tyre_pressure', cleanData.rear_right_tyre_pressure, 205, 265, 1, 20.5, 26.5, 0.1]
    ];

    for(const [field, value, min, max, step, real_min, real_max, real_step] of validatorWithSteps) {
        if(missingFields.has(field)) continue;
        if(!Number.isInteger(value) || value < min || value > max || value % step !== 0) {
            res.locals.errors.push({
                field: field,
                message: `Invalid value for ${fieldLabels[field]}. Please provide an integer between ${real_min} and ${real_max} in increments of ${real_step}.`
            });
        }
    }

    if (res.locals.errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: res.locals.errors
        });
    }

    req.body = cleanData;
    next();
};

export default validateRecord;