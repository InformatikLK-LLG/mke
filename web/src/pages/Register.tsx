import { RegisterForm1, RegisterForm2, RegisterForm3 } from "../components/Form";
import { Outlet } from "react-router-dom";

export default function Register() {
  return <Outlet />;
}

export function Register1() {
  return (
    <div>
      <RegisterForm1 />
    </div>
  );
}

export function Register2() {
  return (
    <div>
      <RegisterForm2 />
    </div>
  );
}

export function Register3() {
  return (
    <div>
      <RegisterForm3 />
    </div>
  );
}
