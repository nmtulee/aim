import { useState } from 'react';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  Yes = 'Yes, delete it!',
  No = 'No, cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className='fixed inset-0 bg-black bg-opacity-50 z-[999] flex justify-center items-center '
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className='bg-white p-6 rounded-lg shadow-lg w-80 text-center'
      >
        <h3 className='text-xl font-semibold text-gray-800'>{message}</h3>
        <div className='mt-4 flex justify-around'>
          <button
            className='bg-red-400 hover:bg-red-500 transition text-white px-4 py-2 rounded-md'
            onClick={() => {
              onConfirm(); // Call the onConfirm callback
              onClose(); // Close the dialog
            }}
          >
            {Yes}
          </button>
          <button
            className='bg-gray-300 hover:bg-gray-400 transition px-4 py-2 rounded-md'
            onClick={onClose}
          >
            {No}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
