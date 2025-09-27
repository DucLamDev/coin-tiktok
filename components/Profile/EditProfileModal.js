import { useState, useRef } from 'react';
import { FiX, FiEdit3, FiUpload } from 'react-icons/fi';
import { usersAPI } from '../../lib/api';
import { setUser } from '../../lib/auth';
import toast from 'react-hot-toast';
import Avatar from './Avatar';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        e.target.value = ''; // Clear the input
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        e.target.value = ''; // Clear the input
        return;
      }

      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('avatar', file);

         const response = await usersAPI.uploadAvatar(formData);
         if (response.data.success) {
           const avatarUrl = response.data.user.avatar;
           setAvatarPreview(`http://localhost:5000${avatarUrl}`);
           setFormData(prev => ({
             ...prev,
             avatar: avatarUrl  // Lưu relative path trong formData
           }));
           
           // Cập nhật cookie với thông tin user mới
           setUser(response.data.user);

           // Emit event để Header refresh avatar
           window.dispatchEvent(new Event('avatarUpdated'));
           
           toast.success('Avatar uploaded successfully!');
         }
      } catch (error) {
        console.error('Avatar upload error:', error);
        toast.error('Failed to upload avatar');
        e.target.value = ''; // Clear the input
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await usersAPI.updateProfile(formData);
      if (response.data.success) {
        // Emit event để Header refresh avatar nếu avatar được update
        if (formData.avatar && formData.avatar !== user.avatar) {
          window.dispatchEvent(new Event('avatarUpdated'));
        }
        
        toast.success('Profile updated successfully!');
        onUpdate(response.data.user);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      username: user?.username || '',
      fullName: user?.fullName || '',
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    });
    setAvatarPreview(user?.avatar || '');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Edit profile</h2>
          <button
            onClick={handleCancel}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">Profile photo</label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar 
                  key={avatarPreview}
                  className="w-16 h-16 rounded-full" 
                  src={avatarPreview} 
                  alt="Profile"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <FiEdit3 className="w-3 h-3 text-gray-700" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Change photo
                </button>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF. Max size 5MB.</p>
              </div>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-600"
            />
            <p className="text-sm text-gray-400 mt-1">
              www.tiktok.com/@{formData.username || 'username'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Usernames can only contain letters, numbers, underscores, and periods. Changing your username will also change your profile link.
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your nickname can only be changed once every 7 days.
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Bio"
              maxLength={80}
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-600 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.bio.length}/80
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
