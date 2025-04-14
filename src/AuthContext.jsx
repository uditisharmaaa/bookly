// src/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import supabase from "./utils/supabaseClient";

// Create the context
const AuthContext = createContext();

// Provider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Fetch initial session once on app load
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    };

    getSession();

    // ✅ Subscribe to auth changes (login, logout, refresh)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // ✅ Cleanup on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access the user in any component
export const useUser = () => useContext(AuthContext);
