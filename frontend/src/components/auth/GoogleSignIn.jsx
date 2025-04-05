import React from 'react'; // ✅ This line is essential for Netlify/Vite to process JSX
import { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const GoogleSignIn = () => {
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { email, name, picture } = decoded;

      const response = await api.post('/auth/google', {
        email,
        name,
        picture,
      });

      if (response.status === 200) {
        login(response.data.token, response.data.user);
      } else {
        console.error('Login failed:', response.data);
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
    }
  };

  const handleFailure = () => {
    console.error('Google sign-in was unsuccessful');
  };

  return (
    <div className="flex justify-center mt-8">
      <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
    </div>
  );
};

export default GoogleSignIn;

