import { useState } from 'react';
import { FiHelpCircle, FiMessageCircle, FiMail, FiPhone, FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';
import Layout from '../../components/Layout/Layout';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: FiHelpCircle },
    { id: 'coins', name: 'Coins & Payments', icon: FiMessageCircle },
    { id: 'account', name: 'Account & Profile', icon: FiMail },
    { id: 'technical', name: 'Technical Issues', icon: FiPhone },
  ];

  const faqs = [
    {
      id: 1,
      category: 'coins',
      question: 'How do I purchase TikTok Coins?',
      answer: 'You can purchase TikTok Coins by going to the "Get Coins" section in your profile menu. Choose from various coin packages and complete the payment using your preferred method (MoMo, ZaloPay, or Credit/Debit Card).'
    },
    {
      id: 2,
      category: 'coins',
      question: 'Can I gift coins to other users?',
      answer: 'Yes! You can gift coins to other TikTok users by using the "Gift Coins" feature. Simply enter their TikTok ID, select the amount, add an optional message, and complete the payment.'
    },
    {
      id: 3,
      category: 'coins',
      question: 'What payment methods are accepted?',
      answer: 'We accept MoMo, ZaloPay, VNPAY QR, Bank Transfer, and major Credit/Debit Cards (Visa, Mastercard, American Express, Discover).'
    },
    {
      id: 4,
      category: 'coins',
      question: 'Can I get a refund for coin purchases?',
      answer: 'Refunds are available within 14 days of purchase, provided the coins have not been used. Once you use any amount of coins, you will no longer be eligible for a refund.'
    },
    {
      id: 5,
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Go to your profile, click on "Edit Profile" to update your username, bio, avatar, and other personal information. Make sure to save your changes when done.'
    },
    {
      id: 6,
      category: 'account',
      question: 'How do I change my password?',
      answer: 'You can change your password in the account settings. For security reasons, you\'ll need to verify your current password before setting a new one.'
    },
    {
      id: 7,
      category: 'technical',
      question: 'The app is running slowly, what should I do?',
      answer: 'Try clearing your browser cache, closing other tabs, or refreshing the page. If the issue persists, check your internet connection or try accessing the site from a different browser.'
    },
    {
      id: 8,
      category: 'technical',
      question: 'I can\'t upload my avatar, what\'s wrong?',
      answer: 'Make sure your image file is less than 5MB and in a supported format (JPG, PNG, GIF). If you\'re still having trouble, try using a different image or browser.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <Layout title="Help & Support - TikTok">
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <FiHelpCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
            <p className="text-gray-600">Find answers to common questions or get in touch with our support team</p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help topics..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      p-4 rounded-lg border-2 transition-all text-left
                      ${selectedCategory === category.id
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <IconComponent className="w-6 h-6 mb-2" />
                    <h3 className="font-medium">{category.name}</h3>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Frequently Asked Questions
              {filteredFAQs.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'})
                </span>
              )}
            </h2>

            {filteredFAQs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No questions found matching your search.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <FiChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <FiChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4 text-gray-600 border-t border-gray-100">
                        <p className="pt-4">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Still need help?</h2>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Email Support */}
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <FiMail className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Get help via email within 24 hours
                </p>
                <button className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Send Email
                </button>
              </div>

              {/* Live Chat */}
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <FiMessageCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Chat with our support team now
                </p>
                <button className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Start Chat
                </button>
              </div>

              {/* Phone Support */}
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <FiPhone className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">Phone Support</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Call us during business hours
                </p>
                <button className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Call Now
                </button>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Support Hours</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Monday - Friday: 9:00 AM - 6:00 PM (GMT+7)</p>
                <p>Saturday: 10:00 AM - 4:00 PM (GMT+7)</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpPage;
