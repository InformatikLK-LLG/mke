import { Navigate, RouteProps } from "react-router";
<<<<<<< HEAD
import type {
  RegisterForm1Inputs,
  RegisterForm2Inputs,
} from "../components/Form";
import { Route, useLocation } from "react-router-dom";

type StateType = {
  registerState: RegisterForm1Inputs & RegisterForm2Inputs;
=======
import { Route, useLocation } from "react-router-dom";

export type StateType = {
  _register_1: { email: string };
  _register_2: { email: string; firstName: string; lastName: string };
>>>>>>> 65b2570 (Implement registration in frontend, Check if email already exists on invite and actually fix password serialization)
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
