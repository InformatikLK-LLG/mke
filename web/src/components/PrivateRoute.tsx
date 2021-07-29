import { Navigate, Route } from "react-router-dom";

import { RouteProps } from "react-router";
import { useAuth } from "../hooks/useAuth";

type PrivateRouteProps = {
  path: string;
  element: JSX.Element;
  rest?: RouteProps;
  children?: JSX.Element | JSX.Element[];
  requiredPrivilege?: Array<string> | string;
};

export default function PrivateRoute({
  path,
  element,
  rest,
  children,
  requiredPrivilege,
}: PrivateRouteProps) {
  const auth = useAuth();

  if (auth.isLoading) return <></>;

  return auth.user ? (
    !requiredPrivilege ||
    auth.user.roles.some((role) =>
      role.privileges.some(
        (privilege) =>
          privilege.id === requiredPrivilege ||
          requiredPrivilege.includes(privilege.id)
      )
    ) ? (
      <Route {...rest} path={path} element={element}>
        {children}
      </Route>
    ) : (
      <>
        <h3>go away please</h3>
      </>
    )
  ) : (
    <Navigate to="/login" />
  );
}
