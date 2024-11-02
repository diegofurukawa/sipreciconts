import { createContext, useContext, useState, useCallback } from 'react';
import { AuthService, TokenService } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: any | null; // Replace 'any' with your user type
  signIn: (credentials: { username: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async (credentials: { username: string; password: string }) => {
    try {
      setLoading(true);
      const response = await AuthService.login(credentials);
      setUser(response.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    isAuthenticated: !!user,
    loading,
    user,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};