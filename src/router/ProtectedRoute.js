import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // console.log("getUser");
  const getUser = JSON.parse(sessionStorage.getItem("user"));
  // console.log(getUser);
  if (getUser === null || getUser.length === 0) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
