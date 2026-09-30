import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nhaa_auth");

      if (!stored) {
        return;
      }

      const authData = JSON.parse(stored);

      if (authData?.access_token && authData?.user) {
        setUser(authData.user);
        setAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth session restore error:", error);
      localStorage.removeItem("nhaa_auth");
    }
  }, []);

  const login = (authData) => {
    if (!authData) {
      return false;
    }

    /*
     * Supports the complete backend response:
     * {
     *   access_token,
     *   token_type,
     *   user
     * }
     */
    if (authData.access_token && authData.user) {
      localStorage.setItem(
        "nhaa_auth",
        JSON.stringify(authData)
      );

      setUser(authData.user);
      setAuthenticated(true);

      return true;
    }

    /*
     * Also supports passing only a user object.
     */
    if (authData.email || authData.id) {
      setUser(authData);
      setAuthenticated(true);

      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem("nhaa_auth");
    localStorage.removeItem("nhaa_mfa");

    setUser(null);
    setAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      user,
      authenticated,
      login,
      logout,
    }),
    [user, authenticated]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}