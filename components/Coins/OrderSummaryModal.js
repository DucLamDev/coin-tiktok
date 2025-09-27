import { useState } from 'react';
import { FiX, FiUser, FiUpload } from 'react-icons/fi';
import { formatCurrency } from '../../lib/utils';
import Avatar from '../Profile/Avatar';

const OrderSummaryModal = ({ 
  isOpen, 
  onClose, 
  orderData, 
  onConfirmPayment,
  isProcessing = false,
  currentUser
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('MoMo');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const paymentMethods = [
    {
      id: 'MoMo',
      name: 'MoMo',
      icon: (
        <img src="https://lf16-co.g-p-static.com/obj/pipo-sgcompliance/sky/momo_4256e5.png" alt="MoMo" className="h-6 w-auto" />
      )
    },
    {
      id: 'ZaloPay',
      name: 'ZaloPay',
      icon: (
        <img src="https://lf16-co.g-p-static.com/obj/pipo-sgcompliance/sky/zalopay_8e254f.png" alt="ZaloPay" className="h-6 w-auto" />
      )
    },
    {
      id: 'Add Credit Or Debit Card',
      name: 'Add Credit Or Debit Card',
      icon: (
        <div className="flex items-center space-x-2">
          <img src="https://lf16-co.g-p-static.com/obj/pipo-sgcompliance/sky/visa_acffbd.png" alt="Visa" className="h-5" />
          <img src="https://lf16-co.g-p-static.com/obj/pipo-sgcompliance/sky/mastercard_light_5865fd.png" alt="Mastercard" className="h-5" />
          <img src="https://lf16-co.g-p-static.com/obj/pipo-sgcompliance/sky/card_american_express_51cd3f.png" alt="Amex" className="h-5" />
          <img src="https://lf16-co.g-p-static.com/obj/pipo-sgcompliance/sky/discover_4adc90.png" alt="Discover" className="h-5" />
        </div>
      )
    },
    {
      id: 'VNPAY QR',
      name: 'VNPAY QR',
      icon: (
        <img src="https://lf16-co.g-p-static.com/obj/pipo-sgcompliance/sky/light_vnpay_b946ce.png" alt="VNPay" className="h-6 w-auto" />
      )
    },
    {
      id: 'Bank Transfer',
      name: 'Bank Transfer',
      icon: (
        <img src="https://lf16-co.g-p-static.com/obj/pipo-sgcompliance/sky/BankTransfer_facae0.png" alt="Bank Transfer" className="h-6 w-auto" />
      )
    }
  ];

  if (!isOpen) return null;

  const handlePayNow = () => {
    onConfirmPayment({
      paymentMethod: selectedPaymentMethod,
      transactionId: orderData.transactionId
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-[748px] h-[703px] overflow-y-auto mx-4 py-[15px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Order summary</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isProcessing}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>


        <div className="p-6 space-y-6">
          {/* Account Info */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3">Account</h3>
            <div className="flex items-center justify-between">
              <span></span>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar 
                    key={avatarPreview || currentUser?.avatar}
                    className="w-8 h-8 rounded-full" 
                    src={avatarPreview || currentUser?.avatar} 
                    alt="User Avatar"
                  />
                  <label className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600">
                    <FiUpload className="w-2 h-2 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <span className="text-base font-medium text-gray-900">{currentUser?.tiktokId || orderData?.targetTiktokId}</span>
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-base text-gray-900">Total</span>
              <span className="text-base font-semibold text-gray-900">₫{formatCurrency(orderData?.priceAmount || 0)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{formatCurrency(orderData?.coinAmount || 0)} Coins</span>
              <span>₫{formatCurrency(orderData?.priceAmount || 0)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">Payment method</h3>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`
                    flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all
                    ${selectedPaymentMethod === method.id 
                      ? 'border-gray-300 bg-gray-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-4 h-4 rounded-full border-2 flex items-center justify-center
                      ${selectedPaymentMethod === method.id 
                        ? 'border-gray-400 bg-white' 
                        : 'border-gray-300 bg-white'
                      }
                    `}>
                      {selectedPaymentMethod === method.id && (
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-900 text-base">{method.name}</span>
                  </div>
                  
                  <div className="flex items-center">
                    {method.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="text-sm text-gray-600 space-y-3">
            <p>
              By tapping <span className="font-semibold">Pay</span>, you agree to our <span className="font-semibold">Virtual Items Policy</span> and acknowledge that you have read <span className="font-semibold">TikTok Privacy Policy</span>. By using any amount of Coins within 14 days after the purchase, you acknowledge and confirm that you will no longer be eligible for a refund.
            </p>
            <p>
              By continuing this purchase, you confirm that you live in <span className="font-semibold">Vietnam</span>.
            </p>
          </div>

          {/* SECURE Payment Badge and TikTok Icons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* TikTok Icon */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600 mt-1">TikTok</span>
              </div>
              
              {/* Bookmark Icon */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
                  </svg>
                </div>
              </div>
              
              {/* Question Mark Icon */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* SECURE Payment Badge */}
            <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-sm font-medium text-green-700">SECURE Payment</span>
            </div>
          </div>

          {/* Pay Now Button */}
          <div className="flex justify-end">
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className={`
                py-3 px-6 rounded-lg font-semibold text-white transition-colors text-base
                ${isProcessing 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-pink-500 hover:bg-pink-600'
                }
              `}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Pay now'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryModal;
