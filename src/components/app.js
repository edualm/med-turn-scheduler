import { h } from 'preact';
import { useState } from 'preact/hooks';

// Fisher-Yates shuffle algorithm to randomize the order of people
const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};

const App = () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [people, setPeople] = useState([{ name: '' }]); // At least one empty input
    const [schedule, setSchedule] = useState([]);
    const [scheduleCalculated, setScheduleCalculated] = useState(false); // To track if the schedule is calculated

    // Handle input change for each person's name
    const handlePersonChange = (index, event) => {
        const newPeople = [...people];
        newPeople[index].name = event.target.value;
        setPeople(newPeople);

        // Automatically add a new person input when the last input is filled
        if (index === people.length - 1 && event.target.value.trim() !== '') {
            addPerson();
        }
    };

    // Add a new empty person input field
    const addPerson = () => {
        setPeople([...people, { name: '' }]);
    };

    // Remove a person input field
    const removePerson = (index) => {
        const newPeople = [...people];
        newPeople.splice(index, 1);
        setPeople(newPeople);
    };

    // Convert time (HH:MM format) to a Date object for today
    const timeToDate = (time) => {
        const [hours, minutes] = time.split(':');
        const now = new Date();
        now.setHours(hours);
        now.setMinutes(minutes);
        now.setSeconds(0);
        return now;
    };

    // Calculate and distribute turns randomly
    const calculateSchedule = () => {
        const start = timeToDate(startTime);
        const end = timeToDate(endTime);

        // Handle crossing midnight: if end is earlier than start, treat it as the next day
        if (end < start) {
            end.setDate(end.getDate() + 1); // Add 1 day to end time
        }

        const totalMinutes = (end - start) / (1000 * 60); // Total duration in minutes

        // Filter out people with empty names
        const validPeople = people.filter(person => person.name.trim() !== '');

        if (validPeople.length === 0) {
            setSchedule([]); // No valid people, no schedule
            return;
        }

        const turns = totalMinutes / validPeople.length; // Equal turn time for each person

        // Randomize the order of valid people
        const shuffledPeople = shuffleArray(validPeople);

        const newSchedule = shuffledPeople.map((person, index) => {
            const personStart = new Date(start.getTime() + turns * index * 60000);
            const personEnd = new Date(personStart.getTime() + turns * 60000);
            return {
                name: person.name,
                startTime: personStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                endTime: personEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
        });

        setSchedule(newSchedule);
        setScheduleCalculated(true); // Hide inputs and show schedule
    };

    // Function to reset the form and show inputs again
    const resetSchedule = () => {
        setScheduleCalculated(false);
        setPeople([{ name: '' }]);
        setStartTime('');
        setEndTime('');
        setSchedule([]);
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="container mx-4 md:mx-auto p-6 bg-white shadow-md rounded-lg max-w-lg overflow-hidden">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">🏥 Agendamento</h1>

                {!scheduleCalculated && (
                    <div>
                        <div className="flex space-x-6 mb-6">
                            <div className="flex-1">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Hora de Início:</label>
                                <input 
                                    type="time" 
                                    value={startTime} 
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full p-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Hora de Fim:</label>
                                <input 
                                    type="time" 
                                    value={endTime} 
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full p-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-4 text-gray-800">Pessoas:</h3>
                        {people.map((person, index) => (
                            <div key={index} className="flex items-center mb-3">
                                <input 
                                    type="text" 
                                    placeholder={`Pessoa ${index + 1}`} 
                                    value={person.name} 
                                    onChange={(e) => handlePersonChange(index, e)}
                                    className="flex-grow p-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {people.length > 1 && (
                                    <button 
                                        onClick={() => removePerson(index)} 
                                        className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Remover
                                    </button>
                                )}
                            </div>
                        ))}

                        <button 
                            onClick={calculateSchedule} 
                            className="mt-4 mb-4 w-full px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Calcular Turnos
                        </button>
                    </div>
                )}

                {scheduleCalculated && (
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-gray-800">Agenda:</h3>
                        <ul className="list-disc pl-6 text-gray-800">
                            {schedule.map((slot, index) => (
                                <li key={index} className="mb-3">
                                    {slot.name}: {slot.startTime} - {slot.endTime}
                                </li>
                            ))}
                        </ul>

                        <button 
                            onClick={resetSchedule} 
                            className="mt-6 w-full px-4 py-3 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Redefinir
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
