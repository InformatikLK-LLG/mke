import {
  RegisterForm1,
  RegisterForm2,
  RegisterForm3,
} from "../components/Form";
import { Outlet, useNavigate } from "react-router-dom";
import { SideBox } from "../components/SideBox";
import useViewport from "../hooks/useViewport";
import Button from "../components/Button";

export default function Register() {
  return <Outlet />;
}

export function Register1() {
  const width = useViewport();
  const navigate = useNavigate();

  return (
    <div className="flexrow">
      <div className="container">
        <h1>Login</h1>
        <RegisterForm1 />
      </div>
      {width > 520 ? (
        <SideBox
          headline="Hallo!"
          subtitle={[
            "hier ganz viel Begrüßungstext",
            "mehrere Zeilen",
            "sogar",
          ]}
          Button={
            <Button
              type={"button"}
              label={"LOGIN"}
              onClick={() => {
                navigate("/login");
              }}
            />
          }
          color="blue"
          size="smol"
        />
      ) : (
        <div className="" />
      )}
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
