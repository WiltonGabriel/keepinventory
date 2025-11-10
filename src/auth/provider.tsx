
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';

// Interface para o estado da sessão de autenticação.
interface AuthSession {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
}

// Cria o Contexto React para a sessão.
const AuthContext = createContext<AuthSession | undefined>(undefined);

// Provedor de Autenticação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const auth = getAuth(initializeFirebase().firebaseApp);
    // onAuthStateChanged é um listener que responde a mudanças no estado de login.
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        setUser(user);
        setIsLoading(false);
      },
      (error) => {
        setError(error);
        setIsLoading(false);
      }
    );

    // Limpa o listener quando o componente é desmontado.
    return () => unsubscribe();
  }, []);

  // Função para fazer logout.
  const signOut = async () => {
    const auth = getAuth(initializeFirebase().firebaseApp);
    await firebaseSignOut(auth);
    setUser(null); // Limpa o usuário localmente.
  };

  const value = { user, isLoading, error, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook customizado para acessar a sessão de autenticação.
export function useAuthSession(): AuthSession {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthSession must be used within an AuthProvider');
  }
  return context;
}
