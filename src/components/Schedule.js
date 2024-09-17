import { h } from 'preact';

const Schedule = ({ schedule, resetSchedule }) => {
    return (
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
    );
};

export default Schedule;
