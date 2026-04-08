import CircuitCard from './CircuitCard.js'

function CircuitList({ circuits, onSelectRecord }) {
    return (
        <section className='panel'>
            <h2>Circuits</h2>
            <div className='circuit-grid'>
                {circuits.map((circuit) => (
                    <CircuitCard key={circuit.id} circuit={circuit} onSelectRecord={onSelectRecord} />
                ))}    
            </div>
        </section>
    );
}

export default CircuitList;