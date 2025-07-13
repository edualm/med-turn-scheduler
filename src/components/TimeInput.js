import { h } from 'preact';

const TimeInput = ({ startTime, endTime, setStartTime, setEndTime }) => (
  <div className="flex space-x-6 mb-6">
    <div className="flex-1">
      <label className="block text-gray-700 text-sm font-bold mb-2">Hora de Início:</label>
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="appearance-none min-h-[2.5rem] w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base"
      />
    </div>
    <div className="flex-1">
      <label className="block text-gray-700 text-sm font-bold mb-2">Hora de Fim:</label>
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="appearance-none min-h-[2.5rem] w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base"
      />
    </div>
  </div>
);

export default TimeInput;
