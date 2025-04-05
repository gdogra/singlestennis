import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import api from '../../utils/api';

const GoogleSignIn = ({ onSuccess }) => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { email, name, picture, sub: googleId } = decoded;

      const res = await api.post('/auth/google', {
        email,
        name,
        avatar: picture,
        googleId,
      });

      const { token } = res.data;
      localStorage.setItem('token', token);
      onSuccess();
    } catch (err) {
      console.error('Google sign-in failed:', err);
    }
  };

  const handleError = () => {
    console.error('Google Sign In was unsuccessful. Try again later.');
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default GoogleSignIn;

