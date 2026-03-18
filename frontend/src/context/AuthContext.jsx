import { createContext, useEffect, useMemo, useState } from "react";

import authService from "../services/authService";
import { clearStoredAuth, getStoredAuth, setStoredAuth } from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const storedSession = getStoredAuth();
  const [user, setUser] = useState(storedSession.user);
  const [session, setSession] = useState(storedSession);
  const [authLoading, setAuthLoading] = useState(Boolean(storedSession.access) && !storedSession.user);

  useEffect(() => {
    const hydrateUser = async () => {
      if (!storedSession.access) {
        setAuthLoading(false);
        return;
      }

      if (storedSession.user) {
        setAuthLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        const nextSession = { ...getStoredAuth(), user: currentUser };
        setStoredAuth(nextSession);
        setSession(nextSession);
        setUser(currentUser);
      } catch {
        clearStoredAuth();
        setSession({ access: null, refresh: null, user: null });
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    hydrateUser();
  }, [storedSession.access, storedSession.user]);

  useEffect(() => {
    const handleExpired = () => {
      clearStoredAuth();
      setSession({ access: null, refresh: null, user: null });
      setUser(null);
    };

    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, []);

  const persistSession = (payload) => {
    const nextSession = {
      access: payload.access,
      refresh: payload.refresh,
      user: payload.user
    };

    setStoredAuth(nextSession);
    setSession(nextSession);
    setUser(payload.user);
    return payload.user;
  };

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    return persistSession(data);
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    return persistSession(data);
  };

  const logout = () => {
    clearStoredAuth();
    setSession({ access: null, refresh: null, user: null });
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      session,
      authLoading,
      isAuthenticated: Boolean(session.access && user),
      login,
      register,
      logout
    }),
    [authLoading, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

