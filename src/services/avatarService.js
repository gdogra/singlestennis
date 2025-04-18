import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useAvatarService = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadAvatar = async (file) => {
    if (!user) {
      return { success: false, error: 'You must be logged in to upload an avatar' };
    }

    if (!file) {
      return { success: false, error: 'No file selected' };
    }

    try {
      setLoading(true);
      setError(null);

      // Create a unique file path for the avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update the user's profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      return { success: true, avatarUrl: publicUrl };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeAvatar = async () => {
    if (!user) {
      return { success: false, error: 'You must be logged in to remove your avatar' };
    }

    try {
      setLoading(true);
      setError(null);

      // Get the current avatar URL
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // If there's an avatar URL, extract the file path and delete it from storage
      if (profile.avatar_url) {
        const avatarPath = profile.avatar_url.split('/').pop();
        if (avatarPath) {
          const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([`avatars/${avatarPath}`]);

          if (deleteError) {
            console.warn('Error deleting avatar file:', deleteError.message);
            // Continue anyway to update the profile
          }
        }
      }

      // Update the user's profile to remove the avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (updateError) throw updateError;

      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadAvatar,
    removeAvatar,
    loading,
    error
  };
};
