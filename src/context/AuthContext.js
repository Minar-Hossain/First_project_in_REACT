import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { browserLocalPersistence, onAuthStateChanged, setPersistence, signOut } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        // Keep app usable even if persistence setup fails.
      }

      if (!isMounted) {
        return;
      }

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setIsAuthLoading(false);
      });

      return unsubscribe;
    }

    let unsubscribeListener;
    initializeAuth().then((unsubscribe) => {
      unsubscribeListener = unsubscribe;
    });

    return () => {
      isMounted = false;
      if (unsubscribeListener) {
        unsubscribeListener();
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthLoading,
      logout: () => signOut(auth),
    }),
    [currentUser, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
