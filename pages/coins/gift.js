import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiUser, FiCopy, FiInfo, FiGift, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout/Layout';
import OrderSummaryModal from '../../components/Coins/OrderSummaryModal';
import { coinsAPI } from '../../lib/api';
import { getUser } from '../../lib/auth';
import { formatCurrency } from '../../lib/utils';

// Default packages for gift coins
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

const GiftCoinsPage = () => {
  const [user, setUser] = useState(null);
  const [coinPackages, setCoinPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [recipientTikTokId, setRecipientTikTokId] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [specialOffer, setSpecialOffer] = useState('5% cash back on your next order');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchedUser, setSearchedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
    }
    loadCoinPackages();
  }, []);

  const loadCoinPackages = async () => {
    try {
      const response = await coinsAPI.getPackages();
      let packages = response.data.packages || [];

      const desiredOrder = [30, 350, 700, 1400, 3500, 7000, 17500];
      packages = packages
        .slice()
        .sort((a, b) => {
          const aIndex = a.isCustom ? Infinity : desiredOrder.indexOf(a.coinAmount);
          const bIndex = b.isCustom ? Infinity : desiredOrder.indexOf(b.coinAmount);
          return aIndex - bIndex;
        });

      if (!packages || packages.length === 0) {
        packages = DEFAULT_PACKAGES;
      }

      setCoinPackages(packages);
      const defaultPackage = packages.find(pkg => pkg.coinAmount === 350) || packages[0];
      if (defaultPackage) {
        setSelectedPackage(defaultPackage);
      }
    } catch (error) {
      console.error('Failed to load coin packages:', error);
    }
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    if (!pkg.isCustom) {
      setCustomAmount('');
    }
  };

  const searchUser = async () => {
    if (!recipientTikTokId.trim()) {
      toast.error('Please enter a TikTok ID');
      return;
    }

    setIsSearching(true);
    try {
      // Simulate user search - in real app, this would be an API call
      setTimeout(() => {
        setSearchedUser({
          tiktokId: recipientTikTokId.trim(),
          username: `User ${recipientTikTokId.trim()}`,
          avatar: null,
          verified: Math.random() > 0.5
        });
        setIsSearching(false);
      }, 1000);
    } catch (error) {
      console.error('User search failed:', error);
      toast.error('User not found');
      setIsSearching(false);
    }
  };

  const handleGiftCoins = async () => {
    if (!user) {
      toast.error('Please log in to gift coins.');
      return;
    }

    if (!recipientTikTokId.trim()) {
      toast.error('Please enter recipient TikTok ID');
      return;
    }

    if (recipientTikTokId.trim() === user.tiktokId) {
      toast.error('You cannot gift coins to yourself');
      return;
    }

    let coinAmount;
    if (selectedPackage?.isCustom) {
      coinAmount = parseInt(customAmount);
      if (!coinAmount || coinAmount < 1) {
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
      const giftData = {
        targetTiktokId: recipientTikTokId.trim(),
        coinAmount,
        paymentMethod: 'MoMo',
        specialOffer,
        isGift: true,
        giftMessage: giftMessage.trim()
      };

      const response = await coinsAPI.createRecharge(giftData);
      setCurrentTransaction(response.data.transaction);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Gift failed:', error);
      toast.error('Failed to create gift order');
    }
  };

  const handleConfirmPayment = async (paymentData) => {
    setIsProcessing(true);
    try {
      const response = await coinsAPI.checkout(paymentData.transactionId, {
        paymentReference: `GIFT_${Date.now()}`
      });

      toast.success('🎁 Gift sent successfully!');
      setShowOrderModal(false);
      
      setTimeout(() => {
        checkTransactionStatus(paymentData.transactionId);
      }, 3000);

    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const checkTransactionStatus = async (transactionId) => {
    try {
      const response = await coinsAPI.getTransaction(transactionId);
      const transaction = response.data.transaction;
      
      if (transaction.status === 'completed') {
        toast.success(`🎉 Gift delivered to @${recipientTikTokId}!`);
        router.push('/transactions');
      } else if (transaction.status === 'failed') {
        toast.error('Gift delivery failed. Please try again.');
      }
    } catch (error) {
      console.error('Failed to check transaction status:', error);
    }
  };

  const calculateTotal = () => {
    if (selectedPackage?.isCustom) {
      const amount = parseInt(customAmount) || 0;
      return amount * 1000;
    }
    return selectedPackage?.priceVND || 0;
  };

  return (
    <Layout title="Gift Coins - TikTok">
      <div className="bg-[#F5F5F5] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <FiGift className="w-6 h-6 text-red-500" />
                <h1 className="text-xl font-semibold text-gray-900">Gift Coins</h1>
              </div>
              <button 
                onClick={() => router.push('/transactions')}
                className="text-sm text-gray-600 hover:text-black underline"
              >
                View transaction history
              </button>
            </div>

            <div className="p-6">
              {/* Gift Info Banner */}
              <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <FiGift className="w-5 h-5 text-pink-600" />
                  <h3 className="font-medium text-pink-800">Send Coins as a Gift</h3>
                </div>
                <p className="text-sm text-pink-700">
                  Surprise your friends and favorite creators with TikTok Coins! 
                  They can use these coins to send gifts during live streams.
                </p>
              </div>

              {/* Recipient Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient TikTok ID
                </label>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={recipientTikTokId}
                      onChange={(e) => setRecipientTikTokId(e.target.value)}
                      placeholder="Enter TikTok ID"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={searchUser}
                    disabled={isSearching}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400 flex items-center space-x-2"
                  >
                    {isSearching ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiSearch className="w-4 h-4" />
                    )}
                    <span>{isSearching ? 'Searching...' : 'Search'}</span>
                  </button>
                </div>

                {/* Searched User Display */}
                {searchedUser && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{searchedUser.username}</span>
                          {searchedUser.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">@{searchedUser.tiktokId}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Gift Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gift Message (Optional)
                </label>
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Add a personal message with your gift..."
                  rows={3}
                  maxLength={200}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">{giftMessage.length}/200 characters</p>
              </div>

              {/* Coin Packages Grid */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Coin Package</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {coinPackages.map((pkg) => (
                    <div
                      key={pkg._id}
                      onClick={() => handlePackageSelect(pkg)}
                      className={`
                        relative p-4 border-2 rounded-lg cursor-pointer transition-all text-center
                        ${selectedPackage?._id === pkg._id 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <FiGift className="w-6 h-6 mr-2 text-red-500" />
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
              </div>

              {/* Custom Amount Input */}
              {selectedPackage?.isCustom && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Amount
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter number of coins"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Special Offer */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-base text-gray-700">Special offer</span>
                  <span className="text-sm text-red-600">{specialOffer}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-base text-gray-600">Total</span>
                <span className="text-base font-bold text-gray-900">₫{formatCurrency(calculateTotal())}</span>
              </div>

              {/* Gift Button */}
              <button
                onClick={handleGiftCoins}
                disabled={!recipientTikTokId.trim() || !selectedPackage}
                className={`
                  w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center space-x-2
                  ${!recipientTikTokId.trim() || !selectedPackage
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-500 hover:bg-red-600'
                  }
                `}
              >
                <FiGift className="w-5 h-5" />
                <span>Send Gift</span>
              </button>
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
      </div>
    </Layout>
  );
};

export default GiftCoinsPage;
