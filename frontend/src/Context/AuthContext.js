import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = React.createContext();

const AuthContextProvider = (props) => {
  const [activeUser, setActiveUser] = useState({});
  // We keep config in state so you can still export it to other components
  const [config, setConfig] = useState({
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  useEffect(() => {
    const controlAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setActiveUser({});
        return;
      }

      try {
        // We define the headers directly here to avoid the dependency error
        const { data } = await axios.get("https://sparko.onrender.com/auth/private", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });
        setActiveUser(data.user);
      } catch (error) {
        localStorage.removeItem("authToken");
        setActiveUser({});
      }
    };

    controlAuth();
  }, []); // Empty array is now safe because we don't rely on external state variables

  return (
    <AuthContext.Provider value={{ activeUser, setActiveUser, config, setConfig }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
