import db from './db.js';

const getConstructors = () => {
    const sql = `
        SELECT id, name
        FROM constructors
        ORDER BY name ASC
    `;
    
    return db.prepare(sql).all();
};

export default { getConstructors };