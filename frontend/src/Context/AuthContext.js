import React, { useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = React.createContext();

const AuthContextProvider = (props) => {
  const [activeUser, setActiveUser] = useState({});
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
        // We define the request config locally here to avoid dependency warnings
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <AuthContext.Provider value={{ activeUser, setActiveUser, config, setConfig }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
