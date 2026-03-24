import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if the user is already logged in when they open the website
  useEffect(() => {
    const token = localStorage.getItem('ecommerce-token');
    const storedUser = localStorage.getItem('ecommerce-user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser)); // Restore the user session
    }
    setLoading(false);
  }, []);

  // Global Logout Function
  const logout = () => {
    localStorage.removeItem('ecommerce-token');
    localStorage.removeItem('ecommerce-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);