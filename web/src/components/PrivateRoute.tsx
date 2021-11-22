import { Navigate, Route } from "react-router-dom";
import { Outlet, RouteProps } from "react-router";

import { useAuth } from "../hooks/useAuth";

type PrivateRouteProps = {
  requiredPrivilege?: Array<string> | string;
};

export default function PrivateRoute({ requiredPrivilege }: PrivateRouteProps) {
  const auth = useAuth();

  if (auth.isLoading) return <></>;

  return auth.user ? (
    !requiredPrivilege ||
    auth.user.roles.some((role) =>
      typeof requiredPrivilege === "string"
        ? role.privileges.find(
            (privilege) => privilege.id === requiredPrivilege
          )
        : requiredPrivilege.every((requiredPrivilege) =>
            role.privileges.find(
              (privilege) => privilege.id === requiredPrivilege
            )
          )
    ) ? (
      <Outlet />
    ) : (
      <>
        <h3>go away please</h3>
      </>
    )
  ) : (
    <Navigate to="/login" />
  );
}
