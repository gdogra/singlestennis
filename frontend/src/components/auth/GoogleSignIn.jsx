// frontend/src/components/auth/GoogleSignIn.jsx

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

      const res = await api.post('/auth/google-login', {
        token: credentialResponse.credential,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      });

      const { token, user } = res.data;
      login(token, user);

    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleError = () => {
    console.warn('Google login was unsuccessful');
  };

  return (
    <div className="flex justify-center mt-6">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        width="100%"
      />
    </div>
  );
};

export default GoogleSignIn;

