// src/components/common/ToggleSwitch.jsx

import React from 'react';

const ToggleSwitch = ({ isChecked, onChange, option1, option2 }) => {
    return (
        <div className="flex justify-between items-center w-full">
            <span className="text-sm font-medium">{option1}</span>
            <label className="flex cursor-pointer select-none items-center">
                <div className="relative">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={onChange}
                        className="sr-only peer"
                    />
                    <div className="h-8 w-14 rounded-full transition-colors duration-300 bg-gray-300 dark:bg-gray-700 peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-blue-600" />
                    <div className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out peer-checked:translate-x-6" />
                </div>
            </label>
            <span className="text-sm font-medium">{option2}</span>
        </div>
    );
};

export default ToggleSwitch;