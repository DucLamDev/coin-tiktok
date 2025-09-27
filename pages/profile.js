import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { FiSearch, FiHome, FiCompass, FiUsers, FiUser, FiTv, FiSend, FiMessageCircle, FiPlus, FiMoreHorizontal, FiEdit3, FiSettings, FiShare, FiHeart, FiBookmark } from 'react-icons/fi';
import { getUser, setUser as setUserCookie } from '../lib/auth';
import { usersAPI } from '../lib/api';
import Avatar from '../components/Profile/Avatar';

// Dynamically import EditProfileModal to avoid SSR issues
const EditProfileModal = dynamic(() => import('../components/Profile/EditProfileModal'), {
  ssr: false
});

const ProfilePageComponent = () => {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('videos');
  const [sortBy, setSortBy] = useState('latest');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      console.log('User avatar URL:', currentUser.avatar);
      setUser(currentUser);
    } else {
      router.push('/auth/login');
    }
    setIsLoading(false);
  }, []); // Chỉ chạy khi component mount

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleProfileUpdate = (updatedUser) => {
    // Update state, update cookie, and notify other components
    setUser(updatedUser);
    setUserCookie(updatedUser);
    window.dispatchEvent(new Event('avatarUpdated'));
    setShowEditModal(false);
  };

  const followingAccounts = [
    { username: 'chú ếch nhỏ', tiktokId: 'trucquyen2610', avatar: '/default-avatar.png' },
    { username: 'Khoai Lang Thang', tiktokId: 'khoailangthang', avatar: '/default-avatar.png', verified: true },
    { username: 'Tra | Remote Wor...', tiktokId: 'yournomadbabe', avatar: '/default-avatar.png' },
    { username: '101 câu chuyện I...', tiktokId: 'ketoanaone', avatar: '/default-avatar.png' },
    { username: 'Bí Ấn Ngàn Năm X', tiktokId: 'bianngannam2', avatar: '/default-avatar.png' }
  ];

  const navigationItems = [
    { icon: FiHome, label: 'For You', active: false },
    { icon: FiCompass, label: 'Explore', active: false },
    { icon: FiUsers, label: 'Following', active: false, notification: true },
    { icon: FiUsers, label: 'Friends', active: false },
    { icon: FiTv, label: 'LIVE', active: false, notification: true },
    { icon: FiSend, label: 'Messages', active: false, notification: 1 },
    { icon: FiMessageCircle, label: 'Activity', active: false, notification: 3 },
    { icon: FiPlus, label: 'Upload', active: false },
    { icon: FiUser, label: 'Profile', active: true },
    { icon: FiMoreHorizontal, label: 'More', active: false }
  ];

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </div>
          <span className="text-lg font-semibold">TikTok</span>
        </div>
        <div className="flex items-center space-x-4">
          <FiPlus className="w-6 h-6" />
          <FiSend className="w-6 h-6" />
                  <Avatar 
                    key={user.avatar}
                    className="w-8 h-8 rounded-full" 
                    src={user.avatar} 
                    alt="Profile"
                  />
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-black border-r border-gray-800 min-h-screen">
          {/* Search Bar */}
          <div className="p-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-600"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="px-4">
            {navigationItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 py-3 px-3 rounded-lg cursor-pointer transition-colors ${
                  item.active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.notification && (
                  <div className="ml-auto">
                    {typeof item.notification === 'number' ? (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.notification}
                      </span>
                    ) : (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Following Accounts */}
          <div className="px-4 mt-8">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Following accounts</h3>
            <div className="space-y-3">
              {followingAccounts.map((account, index) => (
                <div key={index} className="flex items-center space-x-3 py-2">
                <Avatar 
                  className="w-8 h-8 rounded-full" 
                  src={account.avatar} 
                  alt={account.username}
                />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{account.username}</p>
                    <p className="text-xs text-gray-400 truncate">{account.tiktokId}</p>
                  </div>
                  {account.verified && (
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-black">
          {/* Profile Header */}
          <div className="p-6">
            <div className="flex items-start space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <Avatar 
                  key={user.avatar}
                  className="w-24 h-24 rounded-full" 
                  src={user.avatar} 
                  alt="Profile"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <h1 className="text-2xl font-bold">{user.tiktokId}</h1>
                  <span className="text-lg text-gray-300">{user.fullName || user.username}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 mb-4">
                  <button
                    onClick={handleEditProfile}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Edit profile
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Promote post
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <FiSettings className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <FiShare className="w-5 h-5" />
                  </button>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 mb-4">
                  <span className="text-sm">
                    <span className="font-semibold">42</span> Following
                  </span>
                  <span className="text-sm">
                    <span className="font-semibold">10</span> Followers
                  </span>
                  <span className="text-sm">
                    <span className="font-semibold">0</span> Likes
                  </span>
                </div>

                {/* Bio */}
                <p className="text-gray-300">
                  {user.bio || 'No bio yet.'}
                </p>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="border-b border-gray-800">
            <div className="flex space-x-8 px-6">
              {['Videos', 'Favorites', 'Liked'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.toLowerCase()
                      ? 'border-white text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'videos' && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="w-8 h-8 bg-gray-600 rounded"></div>
                    <div className="w-8 h-8 bg-gray-600 rounded"></div>
                    <div className="w-8 h-8 bg-gray-600 rounded"></div>
                    <div className="w-8 h-8 bg-gray-600 rounded"></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload your first video</h3>
                <p className="text-gray-400">Your videos will appear here</p>
                
                {/* Sort Options */}
                <div className="flex justify-end mt-6">
                  <div className="flex space-x-4">
                    {['Latest', 'Popular', 'Oldest'].map((sort) => (
                      <button
                        key={sort}
                        onClick={() => setSortBy(sort.toLowerCase())}
                        className={`text-sm px-3 py-1 rounded ${
                          sortBy === sort.toLowerCase()
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {sort}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

// Make the entire page client-side only to avoid hydration issues
const ProfilePage = dynamic(() => Promise.resolve(ProfilePageComponent), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  )
});

export default ProfilePage;
