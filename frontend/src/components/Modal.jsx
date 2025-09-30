const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div
            className='fixed inset-0 bg-black bg-opacity-50'
            onClick={onClose}
          ></div>

    
          <div className='relative bg-white w-11/12 max-w-md mx-auto p-6 rounded-lg z-10 shadow-lg'>
            <div className='flex justify-end'>
              <button
                className='text-gray-700 font-bold text-lg focus:outline-none'
                onClick={onClose}
              >
                ✕
              </button>
            </div>
            <div className='mt-2'>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
