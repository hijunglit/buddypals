import { useRecoilValue } from "recoil";
import { authAtom } from "./atoms/atom";
import { Navigate, Outlet } from "react-router-dom";

function PublicOnlyRoute() {
  const isAuth = useRecoilValue(authAtom);
  return isAuth.isAuthenticated ? <Navigate to={"/"} replace /> : <Outlet />;
}
export default PublicOnlyRoute;
