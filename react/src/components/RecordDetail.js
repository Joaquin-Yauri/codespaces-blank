import { useEffect, useState } from 'react';
import { formatLapTimeMs } from '../utils/formatLapTime.js';

function RecordDetail({ recordId, onBack }) {
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!recordId) {
            return;
        }

        setLoading(true);
        setError('');

        fetch(`/api/v1/records/${recordId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch record details');
                }
                return response.json();
            })
            .then((result) => {
                setRecord(result.data);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [recordId]);

    const formatScaledHundred = (value) => (value / 100).toFixed(2);
    const formatScaledTen = (value) => (value / 10).toFixed(1);

    if (loading) {
        return <p>Loading record details...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!record) {
        return <p>Record not found.</p>;
    }

    return (
        <section className='detail-layout'>
            <button className='back-button' onClick={onBack}>Back to records</button>

            <div className='detail-hero'>
                <h2>Lap Record Details</h2>

                <div className='detail-summary'>
                    <div className='stat-card'>
                        <p><strong>Lap Time:</strong> {formatLapTimeMs(record.lap_time_ms)}</p>
                    </div>
                    <div className='stat-card'>
                        <p><strong>Weather:</strong> {record.weather}</p>
                    </div>
                    <div className='stat-card'>
                        <p><strong>Controller Type:</strong> {record.controller_type}</p>
                    </div>
                    <div className='stat-card'>
                        <p><strong>Date:</strong> {record.record_date}</p>
                    </div>
                </div>
            </div>

            <div className='detail-grid'>
                <div className='detail-section'>
                    <h3>Circuit</h3>
                    <div className='detail-list'>
                        <div className='detail-row'><span>Name:</span><strong>{record.circuit.name}</strong></div>
                        <div className='detail-row'><span>Country:</span><strong>{record.circuit.country}</strong></div>
                        <div className='detail-row'><span>Track Length:</span><strong>{record.circuit.track_length_km} km</strong></div>
                    </div>
                </div>
                <div className='detail-section'>
                    <h3>Constructor</h3>
                    <div className='detail-list'>
                        <div className='detail-row'><span>Name:</span><strong>{record.constructor.name}</strong></div>
                    </div>
                </div>
            </div>
            <h3>Setup</h3>
            <div className='detail-grid'>
                <div className='detail-section'>
                    <h4>Aerodynamics</h4>
                    <div className='detail-list'>
                        <div className='detail-row'><span>Front Wing Aero:</span><strong>{record.setup.front_wing_aero}</strong></div>
                        <div className='detail-row'><span>Rear Wing Aero:</span><strong>{record.setup.rear_wing_aero}</strong></div>
                    </div>
                </div>

                <div className='detail-section'>
                    <h4>Transmission</h4>
                    <div className='detail-list'>
                        <div className='detail-row'><span>On Throttle Differential:</span><strong>{record.setup.on_throttle_differential}</strong></div>
                        <div className='detail-row'><span>Off Throttle Differential:</span><strong>{record.setup.off_throttle_differential}</strong></div>
                        <div className='detail-row'><span>Engine Braking:</span><strong>{record.setup.engine_braking}</strong></div>
                    </div>
                </div>

                <div className='detail-section'>
                    <h4>Suspension Geometry</h4>
                    <div className='detail-list'>
                        <div className='detail-row'><span>Front Camber:</span><strong>{formatScaledHundred(record.setup.front_camber)}</strong></div>
                        <div className='detail-row'><span>Rear Camber:</span><strong>{formatScaledHundred(record.setup.rear_camber)}</strong></div>
                        <div className='detail-row'><span>Front Toe:</span><strong>{formatScaledHundred(record.setup.front_toe)}</strong></div>
                        <div className='detail-row'><span>Rear Toe:</span><strong>{formatScaledHundred(record.setup.rear_toe)}</strong></div>
                    </div>
                </div>

                <div className='detail-section'>
                    <h4>Suspension</h4>
                    <div className='detail-list'>
                        <div className='detail-row'><span>Front Suspension:</span><strong>{record.setup.front_suspension}</strong></div>
                        <div className='detail-row'><span>Rear Suspension:</span><strong>{record.setup.rear_suspension}</strong></div>
                        <div className='detail-row'><span>Front Anti-Roll Bar:</span><strong>{record.setup.front_anti_roll_bar}</strong></div>
                        <div className='detail-row'><span>Rear Anti-Roll Bar:</span><strong>{record.setup.rear_anti_roll_bar}</strong></div>
                        <div className='detail-row'><span>Front Ride Height:</span><strong>{record.setup.front_ride_height}</strong></div>
                        <div className='detail-row'><span>Rear Ride Height:</span><strong>{record.setup.rear_ride_height}</strong></div>
                    </div>
                </div>

                <div className='detail-section'>
                    <h4>Brakes</h4>
                    <div className='detail-list'>
                        <div className='detail-row'><span>Brake Pressure:</span><strong>{record.setup.brake_pressure}</strong></div>
                        <div className='detail-row'><span>Front Brake Bias:</span><strong>{record.setup.front_brake_bias}</strong></div>
                    </div>
                </div>

                <div className='detail-section'>
                    <h4>Tyres</h4>
                    <div className='detail-list'>
                        <div className='detail-row'><span>Front Left Tyre Pressure:</span><strong>{formatScaledTen(record.setup.front_left_tyre_pressure)}</strong></div>
                        <div className='detail-row'><span>Front Right Tyre Pressure:</span><strong>{formatScaledTen(record.setup.front_right_tyre_pressure)}</strong></div>
                        <div className='detail-row'><span>Rear Left Tyre Pressure:</span><strong>{formatScaledTen(record.setup.rear_left_tyre_pressure)}</strong></div>
                        <div className='detail-row'><span>Rear Right Tyre Pressure:</span><strong>{formatScaledTen(record.setup.rear_right_tyre_pressure)}</strong></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RecordDetail;