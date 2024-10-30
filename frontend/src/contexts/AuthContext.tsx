// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { AuthService } from '../services/api';

interface User {
  id: number;
  login: string;
  name: string;
  company_id: number;
}

interface AuthContextType {
  user: User | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('@App:user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  const login = async (login: string, password: string) => {
    try {
      const response = await AuthService.login(login, password);
      const { user, token } = response;
      
      localStorage.setItem('@App:token', token);
      localStorage.setItem('@App:user', JSON.stringify(user));
      localStorage.setItem('@App:company_id', user.company_id.toString());
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      navigate('/');
    } catch (error) {
      throw new Error('Credenciais inválidas');
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } finally {
      localStorage.removeItem('@App:token');
      localStorage.removeItem('@App:user');
      localStorage.removeItem('@App:company_id');
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};