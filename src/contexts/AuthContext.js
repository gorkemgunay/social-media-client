import { useContext, createContext, useState, useMemo } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  const value = useMemo(
    () => ({
      accessToken,
      setAccessToken,
    }),
    [accessToken],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);

export default AuthProvider;
