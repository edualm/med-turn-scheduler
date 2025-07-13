import { useState, useEffect } from 'preact/hooks';
import TimeInput from './components/TimeInput';
import PeopleSelector from './components/PeopleSelector';
import Schedule from './components/Schedule';

export const getCurrentTime = () => {
    const now = new Date();
    // Debug: log the detected timezone and local time
    console.log('User timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
    console.log('Local time (getHours/getMinutes):', now.getHours(), now.getMinutes());
    // Always use local time for input type="time" (HH:mm, 24h, zero-padded)
    const pad = (n) => n.toString().padStart(2, '0');
    // Use getHours/getMinutes to avoid timezone issues
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const App = () => {
    const [startTime, setStartTime] = useState(getCurrentTime());
    const [endTime, setEndTime] = useState('');
    const [numPeople, setNumPeople] = useState(0);
    const [schedule, setSchedule] = useState([]);
    const [scheduleCalculated, setScheduleCalculated] = useState(false);
    const [error, setError] = useState('');
    const [isPwaMode, setIsPwaMode] = useState(false);

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
            setNumPeople(0);
            return;
        }
        if (isNaN(numPeople) || numPeople <= 0) {
            setError('O número de pessoas deve ser maior que zero.');
            setNumPeople(0);
            return;
        }
        const start = timeToDate(startTime);
        const end = timeToDate(endTime);
        if (!start || !end) {
            setError('Horário inválido. Use o formato HH:mm.');
            setNumPeople(0);
            return;
        }
        let adjustedEnd = new Date(end);
        // If end is before or exactly equal to start, roll over to next day
        if (adjustedEnd <= start) {
            adjustedEnd.setDate(adjustedEnd.getDate() + 1);
        }
        const totalMinutes = (adjustedEnd - start) / (1000 * 60);
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

    useEffect(() => {
        const checkPwa = () => {
            const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
            setIsPwaMode(standalone);
        };
        checkPwa();
        window.addEventListener('resize', checkPwa);
        return () => window.removeEventListener('resize', checkPwa);
    }, []);

    // Footer text with current year
    const footerText = `© 2024 - ${new Date().getFullYear()} Eduardo Almeida`;
    const footerLink = "https://eduardo.engineer";

    return (
        <div className="flex items-center justify-center min-h-screen flex-col pb-safe pt-safe">
            <div className="container mx-2 md:mx-auto p-6 bg-white shadow-lg rounded-2xl max-w-md w-full overflow-hidden">
                <h1 className="text-4xl font-extrabold text-center mb-0 text-indigo-700 tracking-tight">🏥 Agendamento</h1>
                <div className="flex justify-end mb-4">
                    <span className="text-sm text-indigo-600 font-medium tracking-tight pr-1">de turno</span>
                </div>
                {!scheduleCalculated && (
                    <div>
                        {error && (
                            <div className="mb-4 text-red-600 text-base font-medium rounded-lg bg-red-50 p-3 shadow-sm" role="alert">{error}</div>
                        )}
                        <TimeInput 
                            startTime={startTime} 
                            endTime={endTime} 
                            setStartTime={setStartTime} 
                            setEndTime={setEndTime} 
                        />
                        <PeopleSelector 
                            numPeople={numPeople} 
                            handleNumPeopleSelection={(value) => {
                                setNumPeople(value);
                                setError('');
                            }} 
                            disabled={!startTime || !endTime}
                        />
                    </div>
                )}
                {scheduleCalculated && (
                    <div className="space-y-4 animate-fade-in">
                        <Schedule 
                            schedule={schedule} 
                            resetSchedule={resetSchedule} 
                        />
                    </div>
                )}
            </div>
            <footer
                className="fixed bottom-0 left-0 w-full bg-white bg-opacity-90 py-2 text-center text-gray-500 text-xs shadow-inner z-10"
                style={isPwaMode ? { paddingBottom: 'calc(env(safe-area-inset-bottom, 0.5rem) + 1.5rem)' } : {}}
            >
                <a href={footerLink} target="_blank" rel="noopener noreferrer" className="active:opacity-70 focus:underline">{footerText}</a>
            </footer>
        </div>
    );
};

export default App;