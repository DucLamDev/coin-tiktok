import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiHome, FiBarChart3, FiUsers, FiDollarSign, FiTrendingUp, FiVideo, FiCalendar, FiDownload } from 'react-icons/fi';
import Layout from '../../components/Layout/Layout';
import { getUser } from '../../lib/auth';

const CreatorToolsPage = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);
  }, [router]);

  const tools = [
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Track your video performance and audience insights',
      icon: FiBarChart3,
      color: 'bg-blue-500',
      stats: '12.5K views this week'
    },
    {
      id: 'audience',
      title: 'Audience Insights',
      description: 'Understand your followers and their preferences',
      icon: FiUsers,
      color: 'bg-green-500',
      stats: '1.2K followers'
    },
    {
      id: 'monetization',
      title: 'Monetization',
      description: 'Manage your earnings and payment settings',
      icon: FiDollarSign,
      color: 'bg-yellow-500',
      stats: '$125.50 earned'
    },
    {
      id: 'trending',
      title: 'Trending Content',
      description: 'Discover trending hashtags and sounds',
      icon: FiTrendingUp,
      color: 'bg-red-500',
      stats: '50+ trending topics'
    },
    {
      id: 'video-editor',
      title: 'Video Editor',
      description: 'Edit and enhance your videos with built-in tools',
      icon: FiVideo,
      color: 'bg-purple-500',
      stats: 'New features available'
    },
    {
      id: 'scheduler',
      title: 'Content Scheduler',
      description: 'Schedule your posts for optimal engagement',
      icon: FiCalendar,
      color: 'bg-indigo-500',
      stats: '3 posts scheduled'
    }
  ];

  const quickStats = [
    { label: 'Total Views', value: '125.4K', change: '+12.5%', positive: true },
    { label: 'Followers', value: '1.2K', change: '+8.2%', positive: true },
    { label: 'Likes', value: '15.6K', change: '+15.3%', positive: true },
    { label: 'Comments', value: '2.1K', change: '+5.7%', positive: true }
  ];

  if (!user) {
    return (
      <Layout title="Creator Tools">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Creator Tools - TikTok">
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Creator Tools</h1>
            <p className="text-gray-600">Manage your content and grow your audience</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <div key={tool.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <div className={`${tool.color} p-3 rounded-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
                      <p className="text-xs text-gray-500">{tool.stats}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <FiVideo className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">New video uploaded</p>
                  <p className="text-sm text-gray-600">Your latest video is now live and gaining views</p>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiTrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Milestone reached</p>
                  <p className="text-sm text-gray-600">Congratulations! You&apos;ve reached 1K followers</p>
                </div>
                <span className="text-sm text-gray-500">1 day ago</span>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiBarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Weekly report available</p>
                  <p className="text-sm text-gray-600">Your performance report for this week is ready</p>
                </div>
                <span className="text-sm text-gray-500">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatorToolsPage;
