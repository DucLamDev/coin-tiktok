import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiUser, FiCopy, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout/Layout';
import OrderSummaryModal from '../../components/Coins/OrderSummaryModal';
import CustomAmountModal from '../../components/Coins/CustomAmountModal';
import PaymentIcons from '../../components/Coins/PaymentIcons';
import { coinsAPI } from '../../lib/api';
import { getUser } from '../../lib/auth';
import { formatCurrency } from '../../lib/utils';
import Avatar from '../../components/Profile/Avatar';

// Fallback packages to display if API returns none (matches the provided design)
const DEFAULT_PACKAGES = [
  { _id: 'd-30', coinAmount: 30, priceVND: 9800 },
  { _id: 'd-350', coinAmount: 350, priceVND: 113900 },
  { _id: 'd-700', coinAmount: 700, priceVND: 227700 },
  { _id: 'd-1400', coinAmount: 1400, priceVND: 455300 },
  { _id: 'd-3500', coinAmount: 3500, priceVND: 1138100 },
  { _id: 'd-7000', coinAmount: 7000, priceVND: 2276200 },
  { _id: 'd-17500', coinAmount: 17500, priceVND: 5690400 },
  { _id: 'd-custom', isCustom: true, coinAmount: null, priceVND: 0 }
];

const CoinsPage = () => {
  const [user, setUser] = useState(null);
  const [coinPackages, setCoinPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [targetTikTokId, setTargetTikTokId] = useState('');
  const [specialOffer, setSpecialOffer] = useState('5% cash back on your next order');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
      setTargetTikTokId(currentUser.tiktokId); // Set default to current user's ID
    }
    loadCoinPackages();

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadCoinPackages = async () => {
    try {
      const response = await coinsAPI.getPackages();
      let packages = response.data.packages || [];

      // Sort to match the sample order; keep Custom last
      const desiredOrder = [30, 350, 700, 1400, 3500, 7000, 17500];
      packages = packages
        .slice()
        .sort((a, b) => {
          const aIndex = a.isCustom ? Infinity : desiredOrder.indexOf(a.coinAmount);
          const bIndex = b.isCustom ? Infinity : desiredOrder.indexOf(b.coinAmount);
          return aIndex - bIndex;
        });

      // If API returned no active packages, fall back to defaults so the UI always shows
      if (!packages || packages.length === 0) {
        packages = DEFAULT_PACKAGES;
      }

      setCoinPackages(packages);
      // Select the '3,500' coin package by default to match the sample UI
      const defaultPackage = packages.find(pkg => pkg.coinAmount === 3500) || packages.find(pkg => pkg.coinAmount === 30) || packages[0];
      if (defaultPackage) {
        setSelectedPackage(defaultPackage);
      }
    } catch (error) {
      console.error('Failed to load coin packages:', error);
    }
  };


  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    if (pkg.isCustom) {
      if (isMobile) {
        setShowCustomModal(true);
      }
    } else {
      setCustomAmount('');
    }
  };

  const handleRecharge = async (customCoinAmount = null) => {
    if (!user) {
        toast.error('Please log in to recharge.');
        return;
    }

    if (!targetTikTokId.trim()) {
      toast.error('Please enter a TikTok ID');
      return;
    }

    let coinAmount;
    if (selectedPackage?.isCustom) {
      coinAmount = customCoinAmount || parseInt(customAmount);
      if (!coinAmount || coinAmount < 1) {
        if (isMobile) {
            setShowCustomModal(true);
            return;
        }
        toast.error('Please enter a valid coin amount');
        return;
      }
    } else {
      coinAmount = selectedPackage?.coinAmount;
    }

    if (!coinAmount) {
      toast.error('Please select a coin package');
      return;
    }

    try {
      const rechargeData = {
        targetTiktokId: targetTikTokId.trim(),
        coinAmount,
        paymentMethod: 'MoMo', // Default, will be changed in modal
        specialOffer
      };

      const response = await coinsAPI.createRecharge(rechargeData);
      setCurrentTransaction(response.data.transaction);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Recharge failed:', error);
      toast.error('Failed to create recharge order');
    }
  };

  const handleConfirmPayment = async (paymentData) => {
    setIsProcessing(true);
    try {
      const response = await coinsAPI.checkout(paymentData.transactionId, {
        paymentReference: `PAY_${Date.now()}`
      });

      toast.success('Payment processing started!');
      setShowOrderModal(false);
      
      // Poll for transaction status
      setTimeout(() => {
        checkTransactionStatus(paymentData.transactionId);
      }, 3000);

    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const checkTransactionStatus = async (transactionId) => {
    try {
      const response = await coinsAPI.getTransaction(transactionId);
      const transaction = response.data.transaction;
      
      if (transaction.status === 'completed') {
        toast.success('🎉 Recharge completed successfully!');
        router.push('/transactions');
      } else if (transaction.status === 'failed') {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Failed to check transaction status:', error);
    }
  };

  const handleConfirmCustomAmount = (amount) => {
    setCustomAmount(amount);
    setShowCustomModal(false);
    // Use a timeout to ensure state updates before recharge
    setTimeout(() => {
      handleRecharge(parseInt(amount));
    }, 100);
  };

  const copyInviteCode = () => {
    if (user?.tiktokId) {
      navigator.clipboard.writeText(`X9S4RN9P`);
      toast.success('Invite code copied!');
    }
  };

  const calculateTotal = () => {
    if (selectedPackage?.isCustom) {
      const amount = parseInt(customAmount) || 0;
      return amount * 326; // Updated rate: 326 VND per coin
    }
    return selectedPackage?.priceVND || 0;
  };

  return (
    <Layout title="Get Coins - TikTok">
      <div className="bg-white md:bg-[#F5F5F5] min-h-screen">
        <div className="w-full md:max-w-4xl md:mx-auto md:py-6">
          {/* Main Content Card */}
          <div className="md:bg-white md:rounded-lg md:shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100">
              <h1 className="text-xl font-semibold text-gray-900">Get Coins</h1>
              <button 
                onClick={() => router.push('/transactions')}
                className="text-sm text-gray-600 hover:text-black underline"
              >
                View transaction history
              </button>
            </div>

            <div className="p-4 md:p-6">
              {/* User Info Section - Compact Design */}
              <div className="flex items-center justify-between mb-6">
                {/* Left: User Profile */}
                <div className="flex items-center space-x-3">
                  <Avatar 
                    key={user?.avatar}
                    className="w-11 h-11 rounded-full" 
                    src={user?.avatar} 
                    alt="User Avatar"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{user?.tiktokId || 'usertjp8kq6798'}</p>
                    <div className="flex items-center space-x-1">
                      {/* TikTok Coin Icon */}
                      <svg className="w-4 h-4" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="24" fill="#FFB84D"/>
                        <circle cx="24" cy="24" r="18" fill="#F7A300"/>
                        <path d="M34.74 17.77v5.86c-2.06 0-4.05-.44-5.81-1.55v7.2a7.79 7.79 0 0 1-7.84 7.75 7.79 7.79 0 0 1-7.8-8.35 7.79 7.79 0 0 1 9.19-8.24v6c-.47-.13-.9-.26-1.39-.26a3.14 3.14 0 0 0-3.09 2.5 3.14 3.14 0 0 0 3.1 2.5c1.74 0 3.14-1.4 3.14-3.11V12.03h4.69a5.6 5.6 0 0 0 5.81 5.74Z" fill="#F09207"/>
                        <path d="M34.34 18.18a5.78 5.78 0 0 1-5.82-5.74h-3.87v15.63c0 1.94-1.6 3.5-3.56 3.5a3.53 3.53 0 0 1-3.55-3.5 3.53 3.53 0 0 1 4.52-3.38v-3.9a7.38 7.38 0 0 0-8.4 7.28 7.38 7.38 0 0 0 7.43 7.34c4.1 0 7.43-3.29 7.43-7.34v-7.98a9.73 9.73 0 0 0 5.82 1.92v-3.83Z" fill="#fff"/>
                      </svg>
                      <span className="text-sm text-gray-600 font-medium">{user?.coinBalance || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Invite & Get Rewards */}
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm flex items-center">
                      Invite & Get Rewards
                      <svg className="w-4 h-4 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </p>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <span>X954RN9P</span>
                      <button onClick={copyInviteCode} className="p-0.5 text-gray-400 hover:text-gray-600">
                        <FiCopy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* TikTok ID Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TikTok ID to recharge
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={targetTikTokId}
                    onChange={(e) => setTargetTikTokId(e.target.value)}
                    placeholder="Enter TikTok ID"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Recharge Section Header */}
              <div className="mb-4">
                <p className="text-base font-semibold text-gray-900">
                  Recharge: 
                  <span className="text-red-500 font-bold ml-1">Save around 25% with a lower third-party service fee.</span>
                  <FiInfo className="w-4 h-4 text-gray-400 inline-block ml-1" />
                </p>
              </div>

              {/* Coin Packages Grid - 4x2 Layout */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
                {coinPackages.slice(0, 8).map((pkg, index) => (
                  <div
                    key={pkg._id}
                    onClick={() => handlePackageSelect(pkg)}
                    className={`
                      relative p-4 rounded-lg cursor-pointer transition-all text-center min-h-[100px] flex flex-col justify-center
                      ${selectedPackage?._id === pkg._id 
                        ? 'bg-red-50 border-2 border-red-500'
                        : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center mb-2">
                      {/* TikTok Coin Icon */}
                      <svg className="w-7 h-7 mr-2" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="24" fill="#FFB84D"/>
                        <circle cx="24" cy="24" r="18" fill="#F7A300"/>
                        <path d="M34.74 17.77v5.86c-2.06 0-4.05-.44-5.81-1.55v7.2a7.79 7.79 0 0 1-7.84 7.75 7.79 7.79 0 0 1-7.8-8.35 7.79 7.79 0 0 1 9.19-8.24v6c-.47-.13-.9-.26-1.39-.26a3.14 3.14 0 0 0-3.09 2.5 3.14 3.14 0 0 0 3.1 2.5c1.74 0 3.14-1.4 3.14-3.11V12.03h4.69a5.6 5.6 0 0 0 5.81 5.74Z" fill="#F09207"/>
                        <path d="M34.34 18.18a5.78 5.78 0 0 1-5.82-5.74h-3.87v15.63c0 1.94-1.6 3.5-3.56 3.5a3.53 3.53 0 0 1-3.55-3.5 3.53 3.53 0 0 1 4.52-3.38v-3.9a7.38 7.38 0 0 0-8.4 7.28 7.38 7.38 0 0 0 7.43 7.34c4.1 0 7.43-3.29 7.43-7.34v-7.98a9.73 9.73 0 0 0 5.82 1.92v-3.83Z" fill="#fff"/>
                      </svg>
                      <span className="text-xl font-bold text-gray-900">
                        {pkg.isCustom ? 'Custom' : formatCurrency(pkg.coinAmount)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {pkg.isCustom ? 'Large amount supported' : `₫${formatCurrency(pkg.priceVND)}`}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Amount Input - Desktop only */}
              {selectedPackage?.isCustom && (
                <div className="mb-6 hidden md:block">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter coin amount"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Special Offer */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold text-gray-900">Special offer</span>
                    <FiInfo className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base text-gray-900 font-medium">5% cash back on your next order</span>
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Special Offer Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl font-bold text-red-500">5%</div>
                      <div>
                        <p className="text-base font-medium text-gray-900">
                          Recharge once to unlock 5% cash back up to USD250 on your next order
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          From Invite & Get Rewards {'>'} Default invitation code applied. 
                          <span className="text-blue-600 cursor-pointer hover:underline">Change code</span>
                          <svg className="w-3 h-3 inline ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </p>
                      </div>
                    </div>
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm text-gray-600">Payment method</span>
                  <PaymentIcons />
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-base text-gray-600">Total</span>
                <span className="text-base font-bold text-gray-900">₫{formatCurrency(calculateTotal())}</span>
              </div>

              {/* Recharge Button */}
              <div className="mb-4">
                <button
                  onClick={handleRecharge}
                  disabled={!selectedPackage}
                  className={`
                    w-full md:w-60 py-3 px-6 rounded-lg font-semibold text-white transition-all text-base
                    ${!selectedPackage
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600'
                    }
                  `}
                >
                  Recharge
                </button>
              </div>

              {/* Secure Payment Badge */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-green-600">
                  <svg className="w-16 h-6" viewBox="0 0 65 27" fill="none">
                    <rect width="63" height="26" x="1.287" y="0.5" fill="#60A901" fillOpacity="0.1" rx="13" stroke="#60A901"/>
                    <path fill="#8BC73F" fillRule="evenodd" d="M13.736 8.421a.484.484 0 0 1 .674 0c.177.173.472.349.854.515a9.5 9.5 0 0 0 1.202.414 16 16 0 0 0 1.467.332l.022.004h.005c.23.038.399.232.399.46v.168l-.002.473c-.002.408-.006.99-.015 1.687 0 2.007-.9 3.456-1.856 4.395a6.6 6.6 0 0 1-1.383 1.043 4 4 0 0 1-.558.264 1.4 1.4 0 0 1-.472.11 1.4 1.4 0 0 1-.472-.11 4 4 0 0 1-.558-.264 6.6 6.6 0 0 1-1.383-1.043c-.957-.939-1.855-2.387-1.856-4.394a175 175 0 0 1-.016-2.129v-.2c0-.228.168-.422.397-.46h.006l.022-.004a10 10 0 0 0 .414-.079c.275-.056.65-.141 1.053-.253a9.5 9.5 0 0 0 1.203-.414c.382-.166.676-.342.853-.515m2.287 3.49a.24.24 0 0 1-.01.336l-2.089 1.98a.476.476 0 0 1-.646.007l-1.013-.912a.24.24 0 0 1-.018-.336l.319-.354a.24.24 0 0 1 .336-.018l.687.618 1.77-1.676a.24.24 0 0 1 .336.009z" clipRule="evenodd"/>
                    <text x="24" y="16" fill="#161823" fontSize="8" fontWeight="600">SECURE Payment</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Invite & Get Rewards */}
          <div className="mt-6">
            <div className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <img 
                    src="https://sf16-sg.tiktokcdn.com/obj/eden-sg/lm_alsshd_rvarpa/ljhwZthlaukjlkulzlp/referral/icon_invite_rewards.png" 
                    alt="Invite Rewards" 
                    className="w-8 h-8"
                  />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Invite & Get Rewards</p>
                  <p className="text-sm text-gray-600">Check out this new feature!</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Order Summary Modal */}
        <OrderSummaryModal
          isOpen={showOrderModal}
          onClose={() => setShowOrderModal(false)}
          orderData={currentTransaction}
          onConfirmPayment={handleConfirmPayment}
          isProcessing={isProcessing}
          currentUser={user}
        />

        {/* Custom Amount Modal */}
        <CustomAmountModal
          isOpen={showCustomModal}
          onClose={() => setShowCustomModal(false)}
          onConfirm={handleConfirmCustomAmount}
        />
      </div>
    </Layout>
  );
};

export default CoinsPage;
