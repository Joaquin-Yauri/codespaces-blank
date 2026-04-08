import db from './db.js';

const getCircuits = () => {
    const circuits = db.prepare('SELECT * FROM Circuits ORDER BY id').all();
    const referenceTimesQuery = db.prepare(`
        SELECT rank_position, lap_time, player_name
        FROM CircuitGameReferenceTimes
        WHERE circuit_id = ?
        ORDER BY rank_position
    `);
    const userTimesQuery = db.prepare(`
        SELECT lr.id, lr.lap_time_ms, con.name AS constructor_name
        FROM LapRecords lr
        JOIN Constructors con
            ON lr.constructor_id = con.id
        WHERE lr.circuit_id = ?
        ORDER BY lr.lap_time_ms ASC
        LIMIT 5 
    `);
    
    return circuits.map((circuit) => {
        const referenceTimes = referenceTimesQuery.all(circuit.id);
        const userTimes = userTimesQuery.all(circuit.id);

        const userTimesWithLinks = userTimes.map((time) => ({
            ...time,
            links: [
                {
                    rel: 'self',
                    href: `/api/v1/records/${time.id}`
                }
            ]
        }));

        return {
            ...circuit,
            reference_times: referenceTimes,
            user_times: userTimesWithLinks,
            links: [
                {
                    rel: 'self',
                    href: `/api/v1/circuit/${circuit.id}`
                }
            ]
        };
    });
}

export default { 
    getCircuits
}; 

