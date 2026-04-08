import { formatLapTimeMs } from '../utils/formatLapTime.js';
import { getCircuitImage } from '../utils/circuitImages.js';

function CircuitCard({ circuit, onSelectRecord }) {
    const imageUrl = getCircuitImage(circuit.id);
    return (
        <article className="circuit-card" style={{ backgroundImage: `linear-gradient(rgba(29, 35, 46, 0.92), rgba(26, 32, 43, 0.96)), url(${imageUrl})` }}>
            <div className='circuit-meta'>
                <h3>{circuit.name}</h3>

                <p><strong>Country:</strong> {circuit.country}</p>
                <p><strong>Track length:</strong> {circuit.track_length_km} km</p>
                <p>
                    <strong>Real-life fastest lap:</strong> {circuit.real_life_fastest_lap_time} by{' '}
                    {circuit.real_life_fastest_lap_driver} ({circuit.real_life_fastest_lap_year})
                </p>
            </div>

            <div className='data-block'>
                <h4>Top 5 Reference Times</h4>
                {circuit.reference_times.length === 0 ? (
                    <p>No reference times available.</p>
                ) : (
                    <ol>
                        {circuit.reference_times.map((time) => (
                            <li key={time.rank_position}>
                                {time.lap_time} - {time.player_name}
                            </li>
                        ))}
                    </ol>
                )}
            </div>

            <div className='data-block'>
                <h4>Top 5 User Times</h4>
                {circuit.user_times.length === 0 ? (
                    <p>There are no records yet.</p>
                ) : (
                    <ol>
                        {circuit.user_times.map((time) => (
                            <li key={time.id}>
                                <button className='link-button' onClick={() => onSelectRecord(time.id)}>
                                    {formatLapTimeMs(time.lap_time_ms)}
                                </button>{' '}
                                - {time.constructor_name}
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </article>
    );
}

export default CircuitCard;