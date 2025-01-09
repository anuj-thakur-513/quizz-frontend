import { useState } from "react";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>{isLogin ? <Login setIsLogin={setIsLogin} /> : <Signup setIsLogin={setIsLogin} />}</div>
  );
};

export default Auth;
