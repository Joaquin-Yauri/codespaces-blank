import { useEffect, useState } from 'react';
import { formatLapTimeMs } from '../utils/formatLapTime.js';

function RecordsList({ onSelectRecord }) {
    const [records, setRecords] = useState([]);
    const [circuits, setCircuits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [filters, setFilters] = useState({
        weather: '',
        controller_type: '',
        circuit_id: ''
    });

    const buildQueryString = () => {
        const params = new URLSearchParams();

        if (filters.weather) {
            params.append('weather', filters.weather);
        }

        if (filters.controller_type) {
            params.append('controller_type', filters.controller_type);
        }

        if (filters.circuit_id) {
            params.append('circuit_id', filters.circuit_id);
        }

        const queryString = params.toString();
        return queryString ? `?${queryString}` : '';
    };

    const loadRecords = () => {
        setLoading(true);
        setError('');

        fetch(`/api/v1/records${buildQueryString()}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch records');
                }
                return response.json();
            })
            .then((result) => {
                setRecords(result.data);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetch('/api/v1/circuits')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch circuits');
                }
                return response.json();
            })
            .then((result) => {
                setCircuits(result.data);
            })
            .catch(() => {
                setCircuits([]);
            });
    }, []);

    useEffect(() => {
        loadRecords();
    }, [filters]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters((current) => ({
            ...current,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            weather: '',
            controller_type: '',
            circuit_id: ''
        });
    };

    if (loading) {
        return <p>Loading records...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <section className='panel'>
            <h2>All Lap Records</h2>

            <div className='records-toolbar'>
                <div className='field'>
                    <label>
                        Weather:
                        <select name="weather" value={filters.weather} onChange={handleFilterChange}>
                            <option value="">All</option>
                            <option value="Dry">Dry</option>
                            <option value="Wet">Wet</option>
                        </select>
                    </label>
                </div>
     
                <div className='field'>
                    <label>
                        Controller:
                        <select name="controller_type" value={filters.controller_type} onChange={handleFilterChange}>
                            <option value="">All</option>
                            <option value="Controller">Controller</option>
                            <option value="Wheel">Wheel</option>
                        </select>
                    </label>
                </div>
    
                <div className='field'>
                    <label>
                        Circuit:
                        <select name="circuit_id" value={filters.circuit_id} onChange={handleFilterChange}>
                            <option value="">All</option>
                            {circuits.map((circuit) => (
                                <option key={circuit.id} value={circuit.id}>
                                    {circuit.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <button onClick={clearFilters}>Clear Filters</button>
            </div>

            {records.length === 0 ? (
                <p>No records found for the selected filters.</p>
            ) : (
                <div className='record-table-wrap'>
                    <table className='records-table'>
                        <thead>
                            <tr>
                                <th>Lap Time</th>
                                <th>Circuit</th>
                                <th>Constructor</th>
                                <th>Weather</th>
                                <th>Controller</th>
                                <th>Date</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record) => (
                                <tr key={record.id}>
                                    <td>{formatLapTimeMs(record.lap_time_ms)}</td>
                                    <td>{record.circuit_name}</td>
                                    <td>{record.constructor_name}</td>
                                    <td>{record.weather}</td>
                                    <td>{record.controller_type}</td>
                                    <td>{record.record_date}</td>
                                    <td>
                                        <button onClick={() => onSelectRecord(record.id)}>
                                            Show setup
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default RecordsList;