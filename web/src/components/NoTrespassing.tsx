import { Navigate, RouteProps } from "react-router";
import type {
  RegisterForm1Inputs,
  RegisterForm2Inputs,
} from "../components/Form";
import { Route, useLocation } from "react-router-dom";

type StateType = {
  registerState: RegisterForm1Inputs & RegisterForm2Inputs;
};

type NoTrespassingProps = {
  path: string;
  element: JSX.Element;
  rest?: RouteProps;
  children?: JSX.Element;
};

export default function NoTrespassing({
  path,
  element,
  rest,
  children,
}: NoTrespassingProps) {
  const location = useLocation();
  const locationState = location.state as StateType;

  return (
    <Route
      {...rest}
      path={path}
      element={locationState ? element : <Navigate to="/register" />}
    >
      {children}
    </Route>
  );
}
