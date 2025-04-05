import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import api from '../../utils/api';

const GoogleSignIn = ({ onSuccess }) => {
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { email, given_name: firstName, family_name: lastName } = decoded;

      const response = await api.post('/auth/google', {
        email,
        firstName,
        lastName,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Google login failed', err);
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => console.error('Login Failed')}
      />
    </div>
  );
};

export default GoogleSignIn;

