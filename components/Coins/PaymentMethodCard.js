import { useState } from 'react';

const PaymentMethodCard = ({ 
  method, 
  isSelected, 
  onSelect 
}) => {
  const getMethodIcon = (methodName) => {
    switch (methodName) {
      case 'MoMo':
        return (
          <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
        );
      case 'ZaloPay':
        return (
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">Z</span>
          </div>
        );
      case 'Credit Card':
      case 'Add Credit Or Debit Card':
        return (
          <div className="flex space-x-1">
            <div className="w-6 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">V</span>
            </div>
            <div className="w-6 h-4 bg-red-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <div className="w-6 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <div className="w-6 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-400 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">?</span>
          </div>
        );
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`
        payment-method-card flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all
        ${isSelected ? 'border-tiktok-red bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}
      `}
    >
      <div className="flex items-center space-x-3">
        <div className={`
          w-4 h-4 rounded-full border-2 flex items-center justify-center
          ${isSelected ? 'border-tiktok-red bg-tiktok-red' : 'border-gray-300'}
        `}>
          {isSelected && (
            <div className="w-2 h-2 bg-white rounded-full"></div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {getMethodIcon(method)}
          <span className="font-medium text-gray-900">{method}</span>
        </div>
      </div>

      {/* Method specific icons */}
      <div className="flex items-center">
        {method === 'ZaloPay' && (
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">Z</span>
          </div>
        )}
        {(method === 'Credit Card' || method === 'Add Credit Or Debit Card') && (
          <div className="flex space-x-1">
            <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
            <div className="w-6 h-4 bg-red-600 rounded-sm"></div>
            <div className="w-6 h-4 bg-blue-500 rounded-sm"></div>
            <div className="w-6 h-4 bg-orange-500 rounded-sm"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodCard;
