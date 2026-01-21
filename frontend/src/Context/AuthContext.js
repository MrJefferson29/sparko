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
      // If there is no token, don't make the API call and reset user
      const token = localStorage.getItem("authToken");
      if (!token) {
        setActiveUser({});
        return;
      }

      try {
        const { data } = await axios.get(
          "https://sparko.onrender.com/auth/private",
          config
        );
        setActiveUser(data.user);
      } catch (error) {
        localStorage.removeItem("authToken");
        setActiveUser({});
      }
    };

    controlAuth();
  }, [config]); // config added to dependency array to satisfy the linter

  return (
    <AuthContext.Provider
      value={{ activeUser, setActiveUser, config, setConfig }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
