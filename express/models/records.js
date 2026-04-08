import db from './db.js';

const getRecords = ({ circuit_id, constructor_id, weather, controller_type, limit, offset }) => {
    let baseSqlQuery = `
        SELECT lr.id, lr.lap_time_ms, circ.name AS circuit_name, con.name AS constructor_name, lr.weather, lr.controller_type, lr.record_date 
        FROM LapRecords lr
        JOIN Circuits circ
            ON lr.circuit_id = circ.id
        JOIN Constructors con
            ON lr.constructor_id = con.id  
    `;

    const whereConditions = [];
    const values = {};

    if(circuit_id) {
        whereConditions.push('lr.circuit_id = $circuit_id');
        values.$circuit_id = Number(circuit_id);
    }

    if(constructor_id) {
        whereConditions.push('lr.constructor_id = $constructor_id');
        values.$constructor_id = Number(constructor_id);
    }

    if(weather) {
        whereConditions.push('lr.weather = $weather');
        values.$weather = weather;
    }

    if(controller_type) {
        whereConditions.push('lr.controller_type = $controller_type');
        values.$controller_type = controller_type;
    }

    if(whereConditions.length > 0) {
        baseSqlQuery += `WHERE ${whereConditions.join(' AND ')} `; 
    }
    baseSqlQuery += 'ORDER BY lr.record_date DESC, lr.lap_time_ms ASC ';

    if(limit) {
        baseSqlQuery += 'LIMIT $limit ';
        values.$limit = Number(limit);
        if(offset) {
            baseSqlQuery += 'OFFSET $offset ';
            values.$offset = Number(offset);
        }
    }

    const records = db.prepare(baseSqlQuery).all(values);

    return records.map(record => ({
        ...record,
        links: [
            {
                rel: 'self',
                href: `/api/v1/records/${record.id}`
            }
        ]
    }));
};

const getRecordById = (id) => {
    const setupSql = `
        SELECT 
            lr.id, lr.lap_time_ms, circ.name AS circuit_name, con.name AS constructor_name, lr.weather, lr.controller_type, lr.record_date,
            circ.id AS circuit_id, circ.name AS circuit_name, circ.country AS circuit_country, circ.track_length_km, circ.real_life_fastest_lap_time, circ.real_life_fastest_lap_driver, circ.real_life_fastest_lap_year,
            con.id AS constructor_id, con.name AS constructor_name,
            stp.id AS setup_id, stp.front_wing_aero, stp.rear_wing_aero, stp.on_throttle_differential, stp.off_throttle_differential, stp.engine_braking, stp.front_camber, stp.rear_camber, stp.front_toe, stp.rear_toe, 
            stp.front_suspension, stp.rear_suspension, stp.front_anti_roll_bar, stp.rear_anti_roll_bar, stp.front_ride_height, stp.rear_ride_height, stp.brake_pressure, stp.front_brake_bias, stp.front_left_tyre_pressure, stp.front_right_tyre_pressure, stp.rear_left_tyre_pressure, stp.rear_right_tyre_pressure
        FROM LapRecords lr
        JOIN Circuits circ
            ON lr.circuit_id = circ.id
        JOIN Constructors con
            ON lr.constructor_id = con.id
        LEFT JOIN Setups stp
            ON lr.setup_id = stp.id
        WHERE lr.id = $id
    `;
    const values = { $id: Number(id) };
    const record = db.prepare(setupSql).get(values);

    if (!record) {
        return null;
    }

    return {
        id: record.id,
        lap_time_ms: record.lap_time_ms,
        weather: record.weather,
        controller_type: record.controller_type,
        record_date: record.record_date,
        circuit: {
            id: record.circuit_id,
            name: record.circuit_name,
            country: record.circuit_country,
            track_length_km: record.track_length_km,
            real_life_fastest_lap_time: record.real_life_fastest_lap_time,
            real_life_fastest_lap_driver: record.real_life_fastest_lap_driver,
            real_life_fastest_lap_year: record.real_life_fastest_lap_year
        },
        constructor: {
            id: record.constructor_id,
            name: record.constructor_name
        },
        setup: {
            id: record.setup_id,
            front_wing_aero: record.front_wing_aero,
            rear_wing_aero: record.rear_wing_aero,
            on_throttle_differential: record.on_throttle_differential,
            off_throttle_differential: record.off_throttle_differential,
            engine_braking: record.engine_braking,
            front_camber: record.front_camber,
            rear_camber: record.rear_camber,
            front_toe: record.front_toe,
            rear_toe: record.rear_toe,
            front_suspension: record.front_suspension,
            rear_suspension: record.rear_suspension,
            front_anti_roll_bar: record.front_anti_roll_bar,
            rear_anti_roll_bar: record.rear_anti_roll_bar,
            front_ride_height: record.front_ride_height,
            rear_ride_height: record.rear_ride_height,
            brake_pressure: record.brake_pressure,
            front_brake_bias: record.front_brake_bias,
            front_left_tyre_pressure: record.front_left_tyre_pressure,
            front_right_tyre_pressure: record.front_right_tyre_pressure,
            rear_left_tyre_pressure: record.rear_left_tyre_pressure,
            rear_right_tyre_pressure: record.rear_right_tyre_pressure
        },
        links: [
            {
                rel: 'self',
                href: `/api/v1/records/${record.id}`
            },
            {
                rel: 'all-records',
                href: '/api/v1/records'
            },
            {
                rel: 'circuit',
                href: `/api/v1/circuits/${record.circuit_id}`
            },
            {
                rel: 'circuit-records',
                href: `/api/v1/records?circuit_id=${record.circuit_id}`
            }
        ]
    };
};

const createRecord = (recordData) => {
    try {
        db.exec('BEGIN');

        const insertSetupSql = `
            INSERT INTO Setups (
                front_wing_aero, rear_wing_aero, on_throttle_differential, off_throttle_differential, engine_braking,
                front_camber, rear_camber, front_toe, rear_toe,
                front_suspension, rear_suspension, front_anti_roll_bar, rear_anti_roll_bar,
                front_ride_height, rear_ride_height, brake_pressure, front_brake_bias,
                front_left_tyre_pressure, front_right_tyre_pressure, rear_left_tyre_pressure, rear_right_tyre_pressure
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const setupResult = db.prepare(insertSetupSql).run(
            recordData.front_wing_aero,
            recordData.rear_wing_aero,
            recordData.on_throttle_differential,
            recordData.off_throttle_differential,
            recordData.engine_braking,
            recordData.front_camber,
            recordData.rear_camber,
            recordData.front_toe,
            recordData.rear_toe,
            recordData.front_suspension,
            recordData.rear_suspension,
            recordData.front_anti_roll_bar,
            recordData.rear_anti_roll_bar,
            recordData.front_ride_height,
            recordData.rear_ride_height,
            recordData.brake_pressure,
            recordData.front_brake_bias,
            recordData.front_left_tyre_pressure,
            recordData.front_right_tyre_pressure,
            recordData.rear_left_tyre_pressure,
            recordData.rear_right_tyre_pressure
        );

        const setupId = Number(setupResult.lastInsertRowid);

        const insertRecordSql = `
            INSERT INTO LapRecords (
                circuit_id, constructor_id, setup_id, lap_time_ms, weather, controller_type, record_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const recordResult = db.prepare(insertRecordSql).run(
            recordData.circuit_id,
            recordData.constructor_id,
            setupId,
            recordData.lap_time_ms,
            recordData.weather,
            recordData.controller_type,
            recordData.record_date
        );

        const recordId = Number(recordResult.lastInsertRowid);

        db.exec('COMMIT');

        return getRecordById(recordId);
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
};

export default {
    getRecords,
    getRecordById,
    createRecord
};