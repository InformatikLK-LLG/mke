import { Navigate, Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { RouteProps } from "react-router";

type privateRouteProps = {
  path: string;
  element: JSX.Element;
  rest?: RouteProps;
  children?: JSX.Element;
};

export default function PrivateRoute({
  path,
  element,
  rest,
  children,
}: privateRouteProps) {
  const auth = useAuth();

  return (
    <Route
      {...rest}
      path={path}
      element={auth.user ? element : <Navigate to="/login" />}
    >
      {children}
    </Route>
  );
}
