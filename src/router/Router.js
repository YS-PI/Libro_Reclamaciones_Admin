import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginRefactor from "../components/Login/Login";
import LibroReclamos from "../components/LibroReclamos/LibroReclamos";
import ProtectedRoute from "./ProtectedRoute";
import PortectedRouteLogin from "./PortectedRouteLogin";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route index element={<LibroReclamos />} />
          <Route path="/libroreclamos" element={<LibroReclamos />} />
        </Route>
        <Route
          path="/login/:tokenIntranet"
          element={
            <PortectedRouteLogin>
              <LoginRefactor />
            </PortectedRouteLogin>
            // <ImgNotFoundByeJT to="/NotFound" replace />
          }
        />
        <Route
          path="/login"
          element={
            <PortectedRouteLogin>
              <LoginRefactor />
            </PortectedRouteLogin>
            // <ImgNotFoundByeJT to="/NotFound" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
