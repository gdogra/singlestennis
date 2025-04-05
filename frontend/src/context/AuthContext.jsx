import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    setAuthData(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    // optionally refresh or validate session here
  }, []);

  return (
    <AuthContext.Provider value={{ ...authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

