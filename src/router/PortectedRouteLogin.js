import { Navigate } from "react-router-dom";

const PortectedRouteLogin = ({ children }) => {
  const getUser = JSON.parse(sessionStorage.getItem("user"));
  // console.log(getUser);
  if (getUser !== null && getUser?.length !== 0) {
    // console.log(getUser);
    // console.log(getUser?.length);
    return <Navigate to="/" />;
  }
  return children;
};

export default PortectedRouteLogin;
