// src/App.js
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import TimeInput from './components/TimeInput';
import PeopleSelector from './components/PeopleSelector';
import Schedule from './components/Schedule';

const App = () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [numPeople, setNumPeople] = useState(0);
    const [schedule, setSchedule] = useState([]);
    const [scheduleCalculated, setScheduleCalculated] = useState(false);

    const timeToDate = (time) => {
        const [hours, minutes] = time.split(':');
        const now = new Date();
        now.setHours(hours);
        now.setMinutes(minutes);
        now.setSeconds(0);
        return now;
    };

    const calculateSchedule = () => {
        const start = timeToDate(startTime);
        const end = timeToDate(endTime);

        if (end < start) {
            end.setDate(end.getDate() + 1);
        }

        const totalMinutes = (end - start) / (1000 * 60);

        if (numPeople === 0) return;

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
        setStartTime('');
        setEndTime('');
        setSchedule([]);
    };

    useEffect(() => {
        if (numPeople > 0 && startTime && endTime) {
            calculateSchedule();
        }
    }, [numPeople, startTime, endTime]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="container mx-4 md:mx-auto p-6 bg-white shadow-md rounded-lg max-w-lg overflow-hidden">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">🏥 Agendamento</h1>

                {!scheduleCalculated && (
                    <div>
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
        </div>
    );
};

export default App;