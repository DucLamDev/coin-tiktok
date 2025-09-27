import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FiBookmark, FiHeart, FiMessageCircle, FiShare, FiTrash2, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout/Layout';
import { getUser } from '../../lib/auth';

const BookmarksPage = () => {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const router = useRouter();

  // Mock bookmarks data
  const mockBookmarks = [
    {
      id: '1',
      videoId: 'video1',
      title: 'Amazing dance moves! 🔥',
      creator: {
        username: 'dancer_pro',
        tiktokId: 'dancer_pro',
        avatar: null,
        verified: true
      },
      thumbnail: 'https://via.placeholder.com/300x400/ff6b6b/ffffff?text=Dance+Video',
      duration: '0:15',
      likes: 125400,
      comments: 3200,
      shares: 890,
      bookmarkedAt: '2024-01-15T10:30:00Z',
      description: 'Check out this incredible dance routine! #dance #viral #fyp'
    },
    {
      id: '2',
      videoId: 'video2',
      title: 'Cooking hack that will blow your mind! 🍳',
      creator: {
        username: 'chef_master',
        tiktokId: 'chef_master',
        avatar: null,
        verified: false
      },
      thumbnail: 'https://via.placeholder.com/300x400/4ecdc4/ffffff?text=Cooking+Hack',
      duration: '0:30',
      likes: 89200,
      comments: 1500,
      shares: 2100,
      bookmarkedAt: '2024-01-14T15:45:00Z',
      description: 'This cooking trick will save you so much time! #cooking #lifehack #food'
    },
    {
      id: '3',
      videoId: 'video3',
      title: 'Cute puppy compilation 🐕',
      creator: {
        username: 'puppy_lover',
        tiktokId: 'puppy_lover',
        avatar: null,
        verified: false
      },
      thumbnail: 'https://via.placeholder.com/300x400/45b7d1/ffffff?text=Puppy+Video',
      duration: '0:45',
      likes: 234500,
      comments: 5600,
      shares: 1200,
      bookmarkedAt: '2024-01-13T09:20:00Z',
      description: 'The cutest puppies doing adorable things! #puppies #cute #animals'
    }
  ];

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);
    
    // Simulate loading bookmarks
    setTimeout(() => {
      setBookmarks(mockBookmarks);
      setFilteredBookmarks(mockBookmarks);
      setLoading(false);
    }, 1000);
  }, [router, mockBookmarks]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = bookmarks.filter(bookmark => 
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBookmarks(filtered);
    } else {
      setFilteredBookmarks(bookmarks);
    }
  }, [searchQuery, bookmarks]);

  const removeBookmark = (bookmarkId) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    toast.success('Bookmark removed');
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!user) {
    return (
      <Layout title="Bookmarks">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Bookmarks - TikTok">
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FiBookmark className="w-6 h-6 text-red-500" />
                  <h1 className="text-2xl font-bold text-gray-900">Bookmarks</h1>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                    {filteredBookmarks.length}
                  </span>
                </div>
              </div>
              
              {/* Search */}
              <div className="mt-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bookmarks..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FiBookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Start bookmarking videos you want to watch later'
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Discover Videos
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBookmarks.map((bookmark) => (
                <div key={bookmark.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Video Thumbnail */}
                  <div className="relative aspect-[3/4] bg-gray-200">
                    <Image
                      src={bookmark.thumbnail}
                      alt={bookmark.title}
                      layout="fill"
                      className="object-cover"
                      priority={index < 4} // Prioritize loading for the first few images
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {bookmark.duration}
                    </div>
                    <button
                      onClick={() => removeBookmark(bookmark.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-75 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {bookmark.title}
                    </h3>
                    
                    {/* Creator Info */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {bookmark.creator.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">@{bookmark.creator.tiktokId}</span>
                      {bookmark.creator.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <FiHeart className="w-4 h-4" />
                          <span>{formatNumber(bookmark.likes)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiMessageCircle className="w-4 h-4" />
                          <span>{formatNumber(bookmark.comments)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiShare className="w-4 h-4" />
                          <span>{formatNumber(bookmark.shares)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bookmarked Date */}
                    <div className="text-xs text-gray-400">
                      Saved on {formatDate(bookmark.bookmarkedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BookmarksPage;
