import React, { useEffect, useState, useCallback } from "react";

let logoutTimer;
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingTime = adjExpirationTime - currentTime;
  return remainingTime;
};

const retreiveToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationTime = localStorage.getItem("expirationTime");

  const remainingRetreiveTime = calculateTime(storedExpirationTime);
  if (remainingRetreiveTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }
  return {
    token: storedToken,
    expirationTime: storedExpirationTime,
  };
};
export const AuthContextProvider = (props) => {
  const tokenData = retreiveToken();
  let initializeToken;
  if (tokenData) {
    initializeToken = tokenData.token;
  }

  const [token, setToken] = useState(initializeToken);
  const userIsLoggedIn = !!token;
  const logOutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);
  const logInHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);
    const remainingDuration = calculateTime(expirationTime);
    logoutTimer = setTimeout(logOutHandler, remainingDuration);
  };
  useEffect(() => {
    logoutTimer = setTimeout(logOutHandler, tokenData.expirationTime);
  }, [tokenData, logOutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: logInHandler,
    logout: logOutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
