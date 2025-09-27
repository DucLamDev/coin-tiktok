import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiGlobe, FiCheck, FiSearch } from 'react-icons/fi';
import Layout from '../../components/Layout/Layout';
import { getUser } from '../../lib/auth';

const LanguagePage = () => {
  const [user, setUser] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const languages = [
    { code: 'en-US', name: 'English (US)', nativeName: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', flag: '🇬🇧' },
    { code: 'vi-VN', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
    { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼' },
    { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko-KR', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'es-ES', name: 'Spanish (Spain)', nativeName: 'Español (España)', flag: '🇪🇸' },
    { code: 'es-MX', name: 'Spanish (Mexico)', nativeName: 'Español (México)', flag: '🇲🇽' },
    { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'pt-PT', name: 'Portuguese (Portugal)', nativeName: 'Português (Portugal)', flag: '🇵🇹' },
    { code: 'ru-RU', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'th-TH', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
    { code: 'id-ID', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ms-MY', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'tl-PH', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
    { code: 'tr-TR', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'pl-PL', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
    { code: 'nl-NL', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
    { code: 'sv-SE', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
    { code: 'da-DK', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
    { code: 'no-NO', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
    { code: 'fi-FI', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' }
  ];

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);
    
    // Get saved language preference
    const savedLanguage = localStorage.getItem('tiktok-language') || 'en-US';
    setSelectedLanguage(savedLanguage);
  }, [router]);

  const filteredLanguages = languages.filter(language =>
    language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    language.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    localStorage.setItem('tiktok-language', languageCode);
    
    // Here you would typically update the app's language
    // For now, we'll just show a success message
    setTimeout(() => {
      alert(`Language changed to ${languages.find(l => l.code === languageCode)?.name}`);
    }, 500);
  };

  if (!user) {
    return (
      <Layout title="Language Settings">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Language Settings - TikTok">
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <FiGlobe className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Language</h1>
            <p className="text-gray-600">Select your preferred language for the TikTok interface</p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search languages..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Current Selection */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Language</h2>
            <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-2xl">
                {languages.find(l => l.code === selectedLanguage)?.flag}
              </span>
              <div>
                <p className="font-medium text-gray-900">
                  {languages.find(l => l.code === selectedLanguage)?.name}
                </p>
                <p className="text-sm text-gray-600">
                  {languages.find(l => l.code === selectedLanguage)?.nativeName}
                </p>
              </div>
              <FiCheck className="w-5 h-5 text-red-500 ml-auto" />
            </div>
          </div>

          {/* Language List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Available Languages
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredLanguages.length} languages)
                </span>
              </h2>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredLanguages.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No languages found matching your search.
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredLanguages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language.code)}
                      className={`
                        w-full flex items-center space-x-3 p-4 text-left hover:bg-gray-50 transition-colors
                        ${selectedLanguage === language.code ? 'bg-red-50' : ''}
                      `}
                    >
                      <span className="text-2xl">{language.flag}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{language.name}</p>
                        <p className="text-sm text-gray-600">{language.nativeName}</p>
                      </div>
                      {selectedLanguage === language.code && (
                        <FiCheck className="w-5 h-5 text-red-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Changing your language preference will update the interface language. 
              Content language preferences can be managed separately in your content settings.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LanguagePage;
