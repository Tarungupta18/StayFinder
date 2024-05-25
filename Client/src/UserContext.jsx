import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
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
    }
    
  }, []);

  const logout = async () => {
    await axios.post('/logout');
    setUser(null);
    setReady(true);
  };

  return (
    <UserContext.Provider value={{ user, setUser, ready, error, logout }}>
      {children}
    </UserContext.Provider>
  );
}
