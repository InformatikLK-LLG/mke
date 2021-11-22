import { Navigate, Route } from "react-router-dom";
import { Outlet, RouteProps } from "react-router";

import { useAuth } from "../hooks/useAuth";

export default function AuthenticationRoute() {
  const auth = useAuth();

  if (auth.isLoading) return <></>;

  return !auth.user ? <Outlet /> : <Navigate to="/" />;
}
