import { Navigate, Route } from "react-router-dom";

import { RouteProps } from "react-router";
import { useAuth } from "../hooks/useAuth";

type AuthenticationRouteProps = {
  path: string;
  element: JSX.Element;
  rest?: RouteProps;
  children?: JSX.Element | JSX.Element[];
};

export default function AuthenticationRoute({
  path,
  element,
  rest,
  children,
}: AuthenticationRouteProps) {
  const auth = useAuth();

  if (auth.isLoading) return <></>;

  return !auth.user ? (
    <Route {...rest} path={path} element={element}>
      {children}
    </Route>
  ) : (
    <Navigate to="/" />
  );
}
