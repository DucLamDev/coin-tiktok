import { formatCurrency } from '../../lib/utils';

const CoinPackageCard = ({ 
  coinPackage, 
  isSelected, 
  onSelect, 
  isCustom = false 
}) => {
  const { coinAmount, priceVND, discountPercent, isPopular } = coinPackage;

  return (
    <div
      onClick={onSelect}
      className={`
        coin-package-card relative p-4 border-2 rounded-lg cursor-pointer transition-all
        ${isSelected ? 'selected border-tiktok-red bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}
        ${isPopular ? 'popular' : ''}
        ${isCustom ? 'border-dashed' : ''}
      `}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <div className="bg-tiktok-red text-white text-xs px-2 py-1 rounded-full font-medium">
            Save around 25% with a lower third-party service fee.
          </div>
        </div>
      )}

      <div className="text-center">
        {/* Coin Icon and Amount */}
        <div className="flex items-center justify-center mb-2">
          <div className="tiktok-coin-icon w-6 h-6 mr-2">
            <span className="text-sm">💰</span>
          </div>
          <span className="text-xl font-bold text-gray-900">
            {isCustom ? 'Custom' : formatCurrency(coinAmount)}
          </span>
        </div>

        {/* Price */}
        {!isCustom && (
          <div className="text-gray-500 text-sm">
            đ{formatCurrency(priceVND)}
          </div>
        )}

        {isCustom && (
          <div className="text-gray-500 text-sm">
            Large amount supported
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="mt-2">
            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
              -{discountPercent}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinPackageCard;
