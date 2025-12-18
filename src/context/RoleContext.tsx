import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Role = 'directeur' | 'formateur' | 'etudiant';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>('directeur');
  const [userName, setUserName] = useState('Jean Dupont');

  return (
    <RoleContext.Provider value={{ role, setRole, userName, setUserName }}>
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
