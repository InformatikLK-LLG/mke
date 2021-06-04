import { Navigate, RouteProps } from "react-router";
import { Route, useLocation } from "react-router-dom";

export type StateType = {
  _register_1: { email: string };
  _register_2: { email: string; firstName: string; lastName: string };
};

type NoTrespassingProps = {
  path: string;
  element: JSX.Element;
  rest?: RouteProps;
  children?: JSX.Element;
};

type Path = "_register_1" | "_register_2";

export default function NoTrespassing({
  path,
  element,
  rest,
  children,
}: NoTrespassingProps) {
  const location = useLocation();

  const pathname = location.pathname.replaceAll("/", "_") as Path;
  const locationState = location.state as StateType;

  return (
    <Route
      {...rest}
      path={path}
      element={
        locationState?.[pathname] ? element : <Navigate to="/register" />
      }
    >
      {children}
    </Route>
  );
}
