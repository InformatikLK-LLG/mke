import { Navigate, Outlet } from "react-router";
import type {
  RegisterForm1Inputs,
  RegisterForm2Inputs,
} from "../components/Form";

import { useLocation } from "react-router-dom";

type StateType = {
  registerState: RegisterForm1Inputs & RegisterForm2Inputs;
};

export default function NoTrespassing() {
  const location = useLocation();
  const locationState = location.state as StateType;

  return locationState ? <Outlet /> : <Navigate to="/register" />;
}
