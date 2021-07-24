import { Navigate, Route } from "react-router-dom";

import { RouteProps } from "react-router";
import { useAuth } from "../hooks/useAuth";

type PrivateRouteProps = {
  path: string;
  element: JSX.Element;
  rest?: RouteProps;
  children?: JSX.Element | JSX.Element[];
};

export default function PrivateRoute({
  path,
  element,
  rest,
  children,
}: PrivateRouteProps) {
  const auth = useAuth();

  if (auth.isLoading) return <></>;

  return auth.user ? (
    <Route {...rest} path={path} element={element}>
      {children}
    </Route>
  ) : (
    <Navigate to="/login" />
  );
}
