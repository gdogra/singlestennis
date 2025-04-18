import { useState, useRef } from 'react';
import { useAvatarService } from '@/services/avatarService';
import { useAuth } from '@/contexts/AuthContext';

export default function AvatarUpload() {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const avatarService = useAvatarService();
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    setError(null);
    setSuccess(false);

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!fileInputRef.current.files[0]) {
      setError('Please select an image to upload');
      return;
    }

    try {
      const { success, error, avatarUrl } = await avatarService.uploadAvatar(
        fileInputRef.current.files[0]
      );

      if (!success) {
        throw new Error(error || 'Failed to upload avatar');
      }

      setSuccess(true);
      setError(null);
      
      // Reset the file input
      fileInputRef.current.value = '';
      
      // Reload the page after a short delay to show the new avatar
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setError(error.message);
      setSuccess(false);
    }
  };

  const handleRemove = async () => {
    try {
      const { success, error } = await avatarService.removeAvatar();

      if (!success) {
        throw new Error(error || 'Failed to remove avatar');
      }

      setSuccess(true);
      setError(null);
      setPreview(null);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Reload the page after a short delay to show the avatar has been removed
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setError(error.message);
      setSuccess(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Avatar</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Upload a profile picture to personalize your account.</p>
        </div>
        
        <div className="mt-5 flex items-center space-x-6">
          <div className="flex-shrink-0">
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {preview ? (
                <img 
                  src={preview} 
                  alt="Avatar preview" 
                  className="h-24 w-24 object-cover"
                />
              ) : user?.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Current avatar" 
                  className="h-24 w-24 object-cover"
                />
              ) : (
                <span className="text-3xl text-gray-500">
                  {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
              >
                Select Image
              </label>
              
              <button
                type="button"
                onClick={handleUpload}
                disabled={!preview || avatarService.loading}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {avatarService.loading ? 'Uploading...' : 'Upload'}
              </button>
              
              {user?.user_metadata?.avatar_url && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={avatarService.loading}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {avatarService.loading ? 'Removing...' : 'Remove'}
                </button>
              )}
            </div>
            
            <p className="mt-2 text-xs text-gray-500">
              JPG, PNG or GIF. Maximum file size 2MB.
            </p>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        
        {success && (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">
              {preview ? 'Avatar uploaded successfully!' : 'Avatar removed successfully!'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
