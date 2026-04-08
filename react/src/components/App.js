import { useEffect, useState } from "react";
import CircuitList from './CircuitList.js';
import RecordForm from './RecordForm.js';
import RecordList from './RecordList.js';
import RecordDetail from "./RecordDetail.js";

const App = () => {
    const [circuits, setCircuits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [currentView, setCurrentView] = useState([]);
    const [selectedRecordId, setSelectedRecordId] = useState(null);

    const loadCircuits = () => {
        fetch(`/api/v1/circuits`)
        .then((response) => {
            if(!response.ok) {
                throw new Error('Failed to fetch circuits');
            }
            return response.json();
        })
        .then((result) => {
            setCircuits(result.data);
        })
        .catch ((err) => {
            setError(err.message);
        }) 
        .finally (() => {
            setLoading(false);
        })
    };

    useEffect(() => {
        loadCircuits();
    }, []);

    const handleSelectRecord = (id) => {
        setSelectedRecordId(id);
        setCurrentView('record-detail');
    };

    const handleBackToRecords = () => {
        setCurrentView('records');
        setSelectedRecordId(null);
    }

    return  <>
        <main className="app-shell">
            <section className='hero-sec'>
                <p className='hero-kicker'>EA SPORTS F124 Setup Hub</p>
                <h1 className='hero-title'>F1SimSetup</h1>
                <p className='hero-subtitle'>Browse all official circuits, reference times, and player records.</p>
            </section>

            <nav className="top-nav">
                <button className={currentView === 'circuits' ? 'active' : ''} onClick={() => setCurrentView('circuits')}>Circuits</button>
                <button className={currentView === 'records' ? 'active' : ''} onClick={() => setCurrentView('records')}>Records</button>
                <button className={currentView === 'submit' ? 'active' : ''} onClick={() => setCurrentView('submit')}>Submit Record</button>
            </nav>

            {currentView === 'circuits' &&(
                <>           
                    {loading && <p>Loading circuits...</p>}
                    {error && <p>Error: {error}</p>}
                    {!loading && !error && (<CircuitList circuits={circuits} onSelectRecord={handleSelectRecord}/>)} 
                </>
            )}

            {currentView === 'records' && (
                <RecordList onSelectRecord={handleSelectRecord} />
            )}

            {currentView === 'record-detail' && (
                <RecordDetail 
                    recordId={selectedRecordId}
                    onBack={handleBackToRecords}
                />
            )}

            {currentView === 'submit' && (
                <RecordForm onRecordCreated={loadCircuits} />
            )}
        </main>
    </>;
}

export default App;