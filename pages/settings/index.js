import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiSettings, FiUser, FiLock, FiBell, FiEye, FiShield, FiSmartphone, FiGlobe, FiHelpCircle } from 'react-icons/fi';
import Layout from '../../components/Layout/Layout';
import { getUser } from '../../lib/auth';

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('account');
  const router = useRouter();

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);
  }, [router]);

  const settingsTabs = [
    { id: 'account', name: 'Account', icon: FiUser },
    { id: 'privacy', name: 'Privacy', icon: FiLock },
    { id: 'notifications', name: 'Notifications', icon: FiBell },
    { id: 'display', name: 'Display', icon: FiEye },
    { id: 'security', name: 'Security', icon: FiShield },
    { id: 'devices', name: 'Devices', icon: FiSmartphone },
    { id: 'language', name: 'Language', icon: FiGlobe },
    { id: 'support', name: 'Support', icon: FiHelpCircle }
  ];

  const accountSettings = [
    { title: 'Username', value: user?.username, description: 'Your unique username on TikTok' },
    { title: 'Email', value: user?.email, description: 'Email address for your account' },
    { title: 'Phone', value: user?.phone || 'Not added', description: 'Phone number for account recovery' },
    { title: 'Date of Birth', value: user?.dateOfBirth || 'Not set', description: 'Your date of birth' }
  ];

  const privacySettings = [
    { title: 'Private Account', description: 'Only followers can see your videos', toggle: false },
    { title: 'Allow Comments', description: 'Let others comment on your videos', toggle: true },
    { title: 'Allow Duets', description: 'Let others create duets with your videos', toggle: true },
    { title: 'Allow Downloads', description: 'Let others download your videos', toggle: false }
  ];

  const notificationSettings = [
    { title: 'Push Notifications', description: 'Receive notifications on your device', toggle: true },
    { title: 'Email Notifications', description: 'Receive notifications via email', toggle: false },
    { title: 'Like Notifications', description: 'Get notified when someone likes your video', toggle: true },
    { title: 'Comment Notifications', description: 'Get notified when someone comments', toggle: true },
    { title: 'Follower Notifications', description: 'Get notified when someone follows you', toggle: true }
  ];

  if (!user) {
    return (
      <Layout title="Settings">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </Layout>
    );
  }

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
      {accountSettings.map((setting, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">{setting.title}</h3>
            <p className="text-sm text-gray-600">{setting.description}</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-900">{setting.value}</p>
            <button className="text-sm text-red-500 hover:text-red-600">Edit</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
      {privacySettings.map((setting, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">{setting.title}</h3>
            <p className="text-sm text-gray-600">{setting.description}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked={setting.toggle} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
      {notificationSettings.map((setting, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">{setting.title}</h3>
            <p className="text-sm text-gray-600">{setting.description}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked={setting.toggle} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'notifications':
        return renderNotificationSettings();
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">This section is coming soon...</p>
          </div>
        );
    }
  };

  return (
    <Layout title="Settings - TikTok">
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account preferences and privacy settings</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <nav className="space-y-2">
                  {settingsTabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors
                          ${activeTab === tab.id 
                            ? 'bg-red-50 text-red-600 border-l-4 border-red-500' 
                            : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
