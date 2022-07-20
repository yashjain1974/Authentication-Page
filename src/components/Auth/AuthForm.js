import { useState, useRef } from "react";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isweekPassword, setisWeekPassword] = useState(false);
  const [isweekPasswordMes, setisWeekPasswordMes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputEmailRef = useRef();
  const inputPasswordRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  async function addUserDetail(data) {
    await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDL9-razGo1HMXZYtLVAISUgIb--XsB4YQ",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      setIsLoading(false);
      if (res.ok) {
      } else {
        return res.json().then((data) => {
          let errorMessage = "Authentication failed";
          if (data && data.error && data.error.message) {
            setisWeekPassword(true);
            errorMessage = data.error.message;
          }
          setisWeekPasswordMes(errorMessage);
        });
      }
    });
  }

  const submitHandler = (event) => {
    event.preventDefault();
    const entereEmail = inputEmailRef.current.value;
    const enteredPassword = inputPasswordRef.current.value;
    const data = {
      email: entereEmail,
      password: enteredPassword,
      returnSecureToken: true,
    };
    setIsLoading(true);
    if (isLogin) {
    } else {
      addUserDetail(data);
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={inputEmailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={inputPasswordRef}
          />
          {isweekPassword && (
            <p className={classes.invalid}>{isweekPasswordMes}</p>
          )}
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Loading...</p>}

          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
