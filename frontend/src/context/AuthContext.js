import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const storedData = localStorage.getItem('authData');
    return storedData ? JSON.parse(storedData) : null;
  });

  const login = (data) => {
    setAuthData(data);
    localStorage.setItem('authData', JSON.stringify(data));
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem('authData');
  };

  useEffect(() => {
    const storedData = localStorage.getItem('authData');
    if (storedData) {
      setAuthData(JSON.parse(storedData));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

