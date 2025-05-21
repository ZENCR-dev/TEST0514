import React from 'react';

interface PrescriptionActionsProps {
  copies: number;
  onSetCopies: (copies: number) => void;
  onClearPrescription: () => void;
  onGeneratePrescription: () => void;
  isEmpty: boolean;
  itemCount: number;
}

export const PrescriptionActions: React.FC<PrescriptionActionsProps> = ({
  copies,
  onSetCopies,
  onClearPrescription,
  onGeneratePrescription,
  isEmpty,
  itemCount
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex items-center space-x-6 mb-4 md:mb-0">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <label htmlFor="copies" className="text-sm font-medium text-gray-700">
              帖数
            </label>
            <div className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              已选药品: <span className="font-semibold">{itemCount}</span> 种
            </div>
          </div>
          <div className="flex items-center">
            <button
              className="border border-gray-300 rounded-l p-2 bg-gray-50 text-gray-500 hover:bg-gray-100"
              onClick={() => {
                if (copies > 1) {
                  onSetCopies(copies - 1);
                }
              }}
              disabled={isEmpty}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <input
              id="copies"
              type="number"
              min="1"
              max="99"
              className="w-20 text-center p-2 border-t border-b border-gray-300"
              value={copies}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value > 0 && value <= 99) {
                  onSetCopies(value);
                }
              }}
              disabled={isEmpty}
            />
            <button
              className="border border-gray-300 rounded-r p-2 bg-gray-50 text-gray-500 hover:bg-gray-100"
              onClick={() => {
                if (copies < 99) {
                  onSetCopies(copies + 1);
                }
              }}
              disabled={isEmpty}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          className="inline-flex justify-center items-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={onClearPrescription}
          disabled={isEmpty}
        >
          清空处方
        </button>
        <button
          type="button"
          className="inline-flex justify-center items-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={onGeneratePrescription}
          disabled={isEmpty}
        >
          生成处方单
        </button>
      </div>
    </div>
  );
}; 