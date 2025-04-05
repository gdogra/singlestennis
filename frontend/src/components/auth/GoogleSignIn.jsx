import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct way to import with ESM
import api from '../../utils/api';

const GoogleSignIn = ({ onSuccess }) => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await api.post('/auth/google', {
        token: credentialResponse.credential,
        profile: decoded,
      });
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      console.error('Google sign-in failed', err);
    }
  };

  return (
    <div className="google-signin-wrapper">
      <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Login Failed')} />
    </div>
  );
};

export default GoogleSignIn;

