import { h } from 'preact';
import { useState } from 'preact/hooks';

const hours = Array.from({ length: 24 }, (_, index) => index.toString().padStart(2, '0'));
const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

const TimeButton = ({ label, value, placeholder, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    <span className="block text-sm font-bold text-gray-600">{label}</span>
    <span className={`mt-1 block text-2xl font-extrabold tracking-tight ${value ? 'text-gray-900' : 'text-gray-400'}`}>
      {value || placeholder}
    </span>
  </button>
);

const TimeInput = ({ startTime, endTime, setStartTime, setEndTime }) => {
  const [activeField, setActiveField] = useState(null);
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');

  const selectTimePart = (nextPart) => {
    const nextHour = nextPart.hour || selectedHour;
    const nextMinute = nextPart.minute || selectedMinute;

    setSelectedHour(nextHour);
    setSelectedMinute(nextMinute);

    if (!nextHour || !nextMinute) {
      return;
    }

    const nextValue = `${nextHour}:${nextMinute}`;

    if (activeField === 'start') {
      setStartTime(nextValue);
    } else {
      setEndTime(nextValue);
    }

    setActiveField(null);
  };

  const openPicker = (field) => {
    setSelectedHour('');
    setSelectedMinute('');
    setActiveField(field);
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TimeButton
          label="Hora de Início"
          value={startTime}
          placeholder="--:--"
          onClick={() => openPicker('start')}
        />
        <TimeButton
          label="Hora de Fim"
          value={endTime}
          placeholder="--:--"
          onClick={() => openPicker('end')}
        />
      </div>

      {activeField && (
        <div
          className="fixed inset-0 z-20 flex items-end justify-center bg-black bg-opacity-40 px-3 pb-3 sm:items-center"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveField(null)}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300 sm:hidden" />

            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-gray-800">
                  {activeField === 'start' ? 'Hora de Início' : 'Hora de Fim'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveField(null)}
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 active:bg-gray-200"
              >
                Cancelar
              </button>
            </div>

            <div className="mb-3 flex items-center justify-center rounded-xl bg-gray-50 py-3 text-4xl font-extrabold tracking-tight text-indigo-700">
              <span className={selectedHour && selectedMinute ? 'text-indigo-700' : 'text-gray-300'}>
                {selectedHour || '--'}:{selectedMinute || '--'}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 text-sm font-bold text-gray-700">Hora</h3>
              <div className="grid grid-cols-6 gap-2">
                {hours.map((hour) => (
                  <button
                    type="button"
                    key={hour}
                    onClick={() => selectTimePart({ hour })}
                    className={`rounded-full py-2 text-base font-bold ${hour === selectedHour ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-800 active:bg-gray-200'}`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold text-gray-700">Minuto</h3>
              <div className="grid grid-cols-6 gap-2">
                {minutes.map((minute) => (
                  <button
                    type="button"
                    key={minute}
                    onClick={() => selectTimePart({ minute })}
                    className={`rounded-full py-3 text-base font-bold ${minute === selectedMinute ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-800 active:bg-gray-200'}`}
                  >
                    {minute}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeInput;
