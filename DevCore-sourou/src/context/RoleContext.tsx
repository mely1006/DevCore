import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Role = 'directeur' | 'formateur' | 'etudiant';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  userName: string;
  setUserName: (name: string) => void;
  isAuthenticated: boolean;
  login: (name: string, role: Role) => void;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>('directeur');
  const [userName, setUserName] = useState('Jean Dupont');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (name: string, newRole: Role) => {
    setUserName(name);
    setRole(newRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserName('');
    setRole('etudiant');
  };

  return (
    <RoleContext.Provider value={{ role, setRole, userName, setUserName, isAuthenticated, login, logout }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
