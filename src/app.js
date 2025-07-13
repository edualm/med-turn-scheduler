import { useState, useEffect } from 'preact/hooks';
import TimeInput from './components/TimeInput';
import PeopleSelector from './components/PeopleSelector';
import Schedule from './components/Schedule';

export const getCurrentTime = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const App = () => {
    const [startTime, setStartTime] = useState(getCurrentTime());
    const [endTime, setEndTime] = useState('');
    const [numPeople, setNumPeople] = useState(0);
    const [schedule, setSchedule] = useState([]);
    const [scheduleCalculated, setScheduleCalculated] = useState(false);
    const [error, setError] = useState('');

    const timeToDate = (time) => {
        if (!/^\d{2}:\d{2}$/.test(time)) return null;
        const [hours, minutes] = time.split(':');
        const now = new Date();
        now.setHours(Number(hours));
        now.setMinutes(Number(minutes));
        now.setSeconds(0);
        return now;
    };

    const calculateSchedule = () => {
        setError('');
        if (!startTime || !endTime) {
            setError('Por favor, preencha ambos os horários.');
            return;
        }
        if (isNaN(numPeople) || numPeople <= 0) {
            setError('O número de pessoas deve ser maior que zero.');
            return;
        }
        const start = timeToDate(startTime);
        const end = timeToDate(endTime);
        if (!start || !end) {
            setError('Horário inválido. Use o formato HH:mm.');
            return;
        }
        let adjustedEnd = new Date(end);
        if (adjustedEnd < start) {
            adjustedEnd.setDate(adjustedEnd.getDate() + 1);
        }
        const totalMinutes = (adjustedEnd - start) / (1000 * 60);
        if (totalMinutes <= 0) {
            setError('O horário de fim deve ser após o início.');
            return;
        }
        const turns = totalMinutes / numPeople;
        const generatedNames = Array.from({ length: numPeople }, (_, i) => `Pessoa ${i + 1}`);
        const newSchedule = generatedNames.map((person, index) => {
            const personStart = new Date(start.getTime() + turns * index * 60000);
            const personEnd = new Date(personStart.getTime() + turns * 60000);
            return {
                name: person,
                startTime: personStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                endTime: personEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
        });
        setSchedule(newSchedule);
        setScheduleCalculated(true);
    };

    const resetSchedule = () => {
        setScheduleCalculated(false);
        setNumPeople(0);
        setStartTime(getCurrentTime());
        setEndTime('');
        setSchedule([]);
        setError('');
    };

    useEffect(() => {
        if (numPeople > 0 && startTime && endTime && !error) {
            calculateSchedule();
        }
        // eslint-disable-next-line
    }, [numPeople, startTime, endTime]);

    // Footer text with current year
    const footerText = `© 2024 - ${new Date().getFullYear()} Eduardo Almeida`;
    const footerLink = "https://edr.io";

    return (
        <div className="flex items-center justify-center min-h-screen flex-col">
            <div className="container mx-4 md:mx-auto p-6 bg-white shadow-md rounded-lg max-w-lg overflow-hidden">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">🏥 Agendamento</h1>
                {!scheduleCalculated && (
                    <div>
                        {error && (
                            <div className="mb-4 text-red-600 text-sm" role="alert">{error}</div>
                        )}
                        <TimeInput 
                            startTime={startTime} 
                            endTime={endTime} 
                            setStartTime={setStartTime} 
                            setEndTime={setEndTime} 
                        />
                        <PeopleSelector 
                            numPeople={numPeople} 
                            handleNumPeopleSelection={setNumPeople} 
                        />
                    </div>
                )}
                {scheduleCalculated && (
                    <Schedule 
                        schedule={schedule} 
                        resetSchedule={resetSchedule} 
                    />
                )}
            </div>
            <footer className="mt-8 text-center text-gray-500 text-xs">
                <a href={footerLink} target="_blank" rel="noopener noreferrer">{footerText}</a>
            </footer>
        </div>
    );
};

export default App;