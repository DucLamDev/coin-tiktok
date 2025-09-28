import { useState, useEffect } from 'react';

const CustomAmountModal = ({ isOpen, onClose, onConfirm }) => {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    // Reset amount when modal opens
    if (isOpen) {
      setAmount('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyPress = (key) => {
    if (amount.length >= 9) return; // Limit to 9 digits
    setAmount(prev => prev + key);
  };

  const handleBackspace = () => {
    setAmount(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setAmount('');
  };

  const handleConfirm = () => {
    if (amount && parseInt(amount) > 0) {
      onConfirm(amount);
    }
  };

  const KeypadButton = ({ children, onClick, className = '' }) => (
    <button 
      onClick={onClick} 
      className={`py-4 text-2xl rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors ${className}`}>
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white w-full rounded-t-2xl animate-slide-up">
        {/* Header */}
        <div className="relative text-center p-4 border-b border-gray-200">
          <button 
            onClick={onClose} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-light"
            aria-label="Close"
          >&times;</button>
          <h2 className="text-lg font-semibold text-black">Custom</h2>
        </div>

        {/* Amount Display */}
        <div className="p-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#FFB84D"></circle>
              <circle cx="24" cy="24" r="18" fill="#F7A300"></circle>
              <path d="M34.34 18.18a5.78 5.78 0 0 1-5.82-5.74h-3.87v15.63c0 1.94-1.6 3.5-3.56 3.5a3.53 3.53 0 0 1-3.55-3.5 3.53 3.53 0 0 1 4.52-3.38v-3.9a7.38 7.38 0 0 0-8.4 7.28 7.38 7.38 0 0 0 7.43 7.34c4.1 0 7.43-3.29 7.43-7.34v-7.98a9.73 9.73 0 0 0 5.82 1.92v-3.83Z" fill="#fff"></path>
            </svg>
            <span className="text-4xl font-bold tracking-wider h-12 text-black dark:text-white custom-amount-display">
              {amount || <span className="text-gray-400">0</span>}
            </span>
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2 p-4 bg-gray-100">
          <KeypadButton onClick={() => handleKeyPress('1')}>1</KeypadButton>
          <KeypadButton onClick={() => handleKeyPress('2')}>2</KeypadButton>
          <KeypadButton onClick={() => handleKeyPress('3')}>3</KeypadButton>
          <KeypadButton onClick={handleBackspace} className="text-2xl">&#9003;</KeypadButton>
          
          <KeypadButton onClick={() => handleKeyPress('4')}>4</KeypadButton>
          <KeypadButton onClick={() => handleKeyPress('5')}>5</KeypadButton>
          <KeypadButton onClick={() => handleKeyPress('6')}>6</KeypadButton>
          <KeypadButton onClick={() => handleKeyPress('0')}>0</KeypadButton>

          <KeypadButton onClick={() => handleKeyPress('7')}>7</KeypadButton>
          <KeypadButton onClick={() => handleKeyPress('8')}>8</KeypadButton>
          <KeypadButton onClick={() => handleKeyPress('9')}>9</KeypadButton>
          <KeypadButton onClick={handleClear}>C</KeypadButton>
        </div>

        {/* Recharge Button */}
        <div className="p-4">
          <button 
            onClick={handleConfirm}
            disabled={!amount || parseInt(amount) === 0}
            className="w-full py-3 rounded-lg font-semibold text-white text-base transition-colors bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Recharge
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAmountModal;
