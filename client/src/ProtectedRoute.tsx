import { useRecoilValue } from "recoil";
import { authAtom } from "./atoms/atom";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const isAuth = useRecoilValue(authAtom);
  return isAuth.isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} replace />
  );
}
export default ProtectedRoute;
