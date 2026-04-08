import { useEffect, useState } from 'react';

const initialFormData = {
    circuit_id: '',
    constructor_id: '',
    lap_time: '',
    weather: 'Dry',
    controller_type: 'Controller',
    record_date: new Date().toISOString().slice(0, 10),

    front_wing_aero: '',
    rear_wing_aero: '',
    on_throttle_differential: '',
    off_throttle_differential: '',
    engine_braking: '',

    front_camber: '',
    rear_camber: '',
    front_toe: '',
    rear_toe: '',

    front_suspension: '',
    rear_suspension: '',
    front_anti_roll_bar: '',
    rear_anti_roll_bar: '',
    front_ride_height: '',
    rear_ride_height: '',

    brake_pressure: '',
    front_brake_bias: '',

    front_left_tyre_pressure: '',
    front_right_tyre_pressure: '',
    rear_left_tyre_pressure: '',
    rear_right_tyre_pressure: ''
};

function RecordForm({ onRecordCreated }) {
    const [formData, setFormData] = useState(initialFormData);
    const [circuits, setCircuits] = useState([]);
    const [constructors, setConstructors] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        Promise.all([
            fetch('/api/v1/circuits')
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to load circuits.');
                    }
                    return response.json();
                }),
            fetch('/api/v1/constructors')   
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to load constructors.');
                    }
                    return response.json();
                })
        ])
            .then(([circuitsResult, constructorsResult]) => {
                setCircuits(circuitsResult.data);
                setConstructors(constructorsResult.data);
            })
            .catch((error) => {
                setErrors([{ 
                    field: 'form', 
                    message: error.message 
                }]);
            })
            .finally(() => {
                setLoadingOptions(false);
            });
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitting(true);
        setSuccessMessage('');
        setErrors([]);

        try {
            const response = await fetch('/api/v1/records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if(!response.ok) {
                setErrors(
                    result?.errors ||
                    [{ field: 'form', message: result?.message || `Request failed (${response.status})` }]
                );
                return;
            }
            setSuccessMessage('Record submitted successfully.');

            if(onRecordCreated) {
                onRecordCreated();
            }
            setFormData({
                ...initialFormData,
                weather: 'Dry',
                controller_type: 'Controller',
                record_date: new Date().toISOString().slice(0, 10)
            });
        } catch (error) {
            setErrors([{ 
                field: 'form', 
                message: error.message 
            }]);
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingOptions) {
        return <p>Loading form options...</p>;
    }

    return (
        <section className='panel'>
            <h2>Submit a Lap Record</h2>

            {successMessage && <p className='message success'>{successMessage}</p>}

            {errors.length > 0 && (
                <div className='message error'>
                    <h3>Please fix these issues:</h3>
                    <ul>
                        {errors.map((error, index) => (
                            <li key={`${error.field}-${index}`}>
                                {error.field}: {error.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Record Info</legend>

                    <div className='form-grid'>
                        <div className='field'>
                            <label>Circuit: </label>
                                <select name="circuit_id" value={formData.circuit_id} onChange={handleChange}>
                                    <option value="">Select a circuit</option>
                                    {circuits.map((circuit) => (
                                        <option key={circuit.id} value={circuit.id}>
                                            {circuit.name}
                                        </option>
                                    ))}
                                </select>
                        </div>

                        <div className='field'>
                            <label>Constructor: </label>
                                <select name="constructor_id" value={formData.constructor_id} onChange={handleChange}>
                                    <option value="">Select a constructor</option>
                                    {constructors.map((constructor) => (
                                        <option key={constructor.id} value={constructor.id}>
                                            {constructor.name}
                                        </option>
                                    ))}
                                </select>
                        </div>
                
                        <div className="field">                
                            <label>Lap Time: </label>
                                <input
                                    type="text"
                                    name="lap_time"
                                    value={formData.lap_time}
                                    onChange={handleChange}
                                    placeholder="1:30.371"
                                />
                                <small>Format: M:SS.mmm</small>
                        </div>
                        <div className="field">           
                            <label>Record Date: </label>
                                <input
                                    type="date"
                                    name="record_date"
                                    value={formData.record_date}
                                    onChange={handleChange}
                                />
                                <small>Format: MM/DD/YYYY</small>
                        </div>     
                    </div> 

                    <div className='field' style={{ marginTop: '14px' }}>        
                        <span className='fieldset-title'>Weather: </span>
                        <div className='radio-row'>
                            <label className='radio-option'>
                                <input
                                    type="radio"
                                    name="weather"
                                    value="Dry"
                                    checked={formData.weather === 'Dry'}
                                    onChange={handleChange}
                                />
                                Dry
                            </label>
                            <label className='radio-option'>
                                <input
                                    type="radio"
                                    name="weather"
                                    value="Wet"
                                    checked={formData.weather === 'Wet'}
                                    onChange={handleChange}
                                />
                                Wet
                            </label>
                        </div>
                    </div>
                    <div className='field' style={{ marginTop: '14px' }}>        
                        <span className='fieldset-title'>Controller Type: </span>
                        <div className='radio-row'>
                            <label className='radio-option'>
                                <input
                                    type="radio"
                                    name="controller_type"
                                    value="Controller"
                                    checked={formData.controller_type === 'Controller'}
                                    onChange={handleChange}
                                />
                                Controller
                            </label>
                            <label className='radio-option'>
                                <input
                                    type="radio"
                                    name="controller_type"
                                    value="Wheel"
                                    checked={formData.controller_type === 'Wheel'}
                                    onChange={handleChange}
                                />
                                Wheel
                            </label>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Aerodynamics</legend>
                    <div className='form-grid--tight'>
                        <div className='field'>                    
                            <label>Front Wing Aero: </label>
                            <input type="number" name="front_wing_aero" min="0" max="50" value={formData.front_wing_aero} onChange={handleChange}
                            placeholder='0 to 50' />
                        </div>
                        <div className='field'>
                            <label>Rear Wing Aero: </label>
                            <input type="number" name="rear_wing_aero" min="0" max="50" value={formData.rear_wing_aero} onChange={handleChange}
                            placeholder='0 to 50' />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Transmission</legend>
                    <div className='form-grid--tight'>
                        <div className='field'>             
                            <label>On Throttle Differential: </label>
                            <input type="number" step="5" name="on_throttle_differential" min="10" max="100" value={formData.on_throttle_differential} onChange={handleChange}
                            placeholder='10 to 100 (step 5)' />
                        </div>     

                        <div className='field'>  
                            <label> Off Throttle Differential: </label>  
                            <input type="number" step="5" name="off_throttle_differential" min="10" max="100" value={formData.off_throttle_differential} onChange={handleChange}
                            placeholder='10 to 100 (step 5)' />
                        </div>
                        
                        <div className='field'>
                            <label>Engine Braking: </label>
                            <input type="number" step="10" name="engine_braking" min="0" max="100" value={formData.engine_braking} onChange={handleChange}
                            placeholder='0 to 100 (step 10)' />
                        </div>    
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Suspension Geometry</legend>
                    <div className='form-grid--tight'>               
                        <div className='field'> 
                            <label>Front Camber: </label>
                            <input type="number" step="0.1" name="front_camber" min="-3.5" max="-2.5" value={formData.front_camber} onChange={handleChange} 
                            placeholder='-3.5 to -2.5'/>
                        </div>
                        <div className='field'>                     
                            <label>Rear Camber: </label>
                            <input type="number" step="0.1" name="rear_camber" min="-2.2" max="-0.7" value={formData.rear_camber} onChange={handleChange}
                            placeholder='-2.2 to -0.7' />
                        </div>
                        <div className='field'> 
                            <label>Front Toe: </label>
                            <input type="number" step="0.01" name="front_toe" min="0.00" max="0.50" value={formData.front_toe} onChange={handleChange}
                            placeholder='0.00 to 0.50' />
                        </div>
                        <div className='field'>
                            <label>Rear Toe: </label>
                            <input type="number" step="0.01" name="rear_toe" min="0.00" max="0.50" value={formData.rear_toe} onChange={handleChange}
                            placeholder='0.00 to 0.50' />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Suspension</legend>
                    <div className='form-grid--tight'>
                        <div className='field'>             
                            <label>Front Suspension: </label>
                            <input type="number" name="front_suspension" min="1" max="41" value={formData.front_suspension} onChange={handleChange}
                            placeholder='1 to 41' />
                        </div> 
                        <div className='field'>
                            <label>Rear Suspension: </label>
                            <input type="number" name="rear_suspension" min="1" max="41" value={formData.rear_suspension} onChange={handleChange}
                            placeholder='1 to 41' />
                        </div>
                        <div className='field'>
                            <label>Front Anti-Roll Bar: </label>
                            <input type="number" name="front_anti_roll_bar" min="1" max="21" value={formData.front_anti_roll_bar} onChange={handleChange}
                            placeholder='1 to 21' />
                        </div>
                        <div className='field'>
                            <label>Rear Anti-Roll Bar: </label>
                            <input type="number" name="rear_anti_roll_bar" min="1" max="21" value={formData.rear_anti_roll_bar} onChange={handleChange}
                            placeholder='1 to 21' />
                        </div>
                        <div className='field'>   
                            <label>Front Ride Height: </label>
                            <input type="number" name="front_ride_height" min="10" max="40" value={formData.front_ride_height} onChange={handleChange}
                            placeholder='10 to 40' />
                        </div>
                        <div className='field'>
                            <label>Rear Ride Height: </label>
                            <input type="number" name="rear_ride_height" min="40" max="100" value={formData.rear_ride_height} onChange={handleChange}
                            placeholder='40 to 100' />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Brakes</legend>
                    <div className='form-grid--tight'>
                        <div className='field'>            
                            <label>Brake Pressure: </label>
                            <input type="number" name="brake_pressure" min="80" max="100" value={formData.brake_pressure} onChange={handleChange}
                            placeholder='80 to 100' />
                        </div>
                        <div className='field'>           
                            <label>Front Brake Bias: </label> 
                            <input type="number" name="front_brake_bias" min="50" max="70" value={formData.front_brake_bias} onChange={handleChange}
                            placeholder='50 to 70' />
                        </div> 
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Tyres</legend>
                    <div className='form-grid--tight'>
                        <div className='field'>
                            <label> Front Left Tyre Pressure: </label>
                            <input type="number" step="0.1" name="front_left_tyre_pressure" min="22.5" max="29.5" value={formData.front_left_tyre_pressure} onChange={handleChange}
                            placeholder='22.5 to 29.5' />
                        </div>

                        <div className='field'>
                            <label> Front Right Tyre Pressure: </label>
                            <input type="number" step="0.1" name="front_right_tyre_pressure" min="22.5" max="29.5" value={formData.front_right_tyre_pressure} onChange={handleChange}
                            placeholder='22.5 to 29.5' />
                        </div>

                        <div className='field'>
                            <label>Rear Left Tyre Pressure: </label>
                            <input type="number" step="0.1" name="rear_left_tyre_pressure" min="20.5" max="26.5" value={formData.rear_left_tyre_pressure} onChange={handleChange}
                            placeholder='20.5 to 26.5' />
                        </div>

                        <div className='field'>
                            <label>Rear Right Tyre Pressure: </label>
                            <input type="number" step="0.1" name="rear_right_tyre_pressure" min="20.5" max="26.5" value={formData.rear_right_tyre_pressure} onChange={handleChange}
                            placeholder='20.5 to 26.5' />
                        </div>
                    </div>
                </fieldset>

                <div className='form-action'>                   
                    <button className='form-submit' type="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Record'}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default RecordForm;