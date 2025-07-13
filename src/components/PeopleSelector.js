import { h } from 'preact';

const PeopleSelector = ({ numPeople, handleNumPeopleSelection, disabled }) => {
    return (
        <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Número de Pessoas:</h3>
            <div className="flex w-full gap-2 mb-6">
                {[1, 2, 3, 4, 5].map(number => (
                    <button 
                        key={number}
                        onClick={() => !disabled && handleNumPeopleSelection(number)}
                        className={`flex-1 px-4 py-2 rounded transition-colors duration-150 ${
                            disabled
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : numPeople === number
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-300 text-gray-800 hover:bg-blue-600 hover:text-white'
                        }`}
                        disabled={disabled}
                        aria-disabled={disabled}
                        tabIndex={disabled ? -1 : 0}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PeopleSelector;