// src/components/auth/GoogleSignIn.jsx

import { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // ✅ Named import
import api from '../../utils/api';

const GoogleSignIn = ({ onLogin }) => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const decoded = jwtDecode(token); // ✅ Updated usage
      const { email, given_name: firstName, family_name: lastName, picture: avatar } = decoded;

      // Send user info to your backend
      const res = await api.post('/auth/google', {
        email,
        firstName,
        lastName,
        avatar,
        token,
      });

      const { user, accessToken } = res.data;
      localStorage.setItem('token', accessToken);
      onLogin(user);
    } catch (error) {
      console.error('Google login failed', error);
    }
  };

  const handleError = () => {
    console.error('Login Failed');
  };

  return (
    <div className="google-signin">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default GoogleSignIn;

