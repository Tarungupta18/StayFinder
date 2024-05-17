import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/profile")
      .then(({ data }) => {
        setUser(data);
        setReady(true);
      })
      .catch((error) => {
        setError(error);
        setReady(true);
      });
  }, []);

  const value = {
    user,
    setUser,
    ready,
    error,
    logout: () => {
      setUser(null);
      setReady(false);
      // You might want to clear cookies or tokens here
      // e.g., axios.post('/logout').then(() => ...)
    },
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
