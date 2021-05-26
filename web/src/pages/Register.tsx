import { RegisterForm1, RegisterForm2, RegisterForm3 } from "../components/Form";
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
  const isDesktop = width > 730;

  return (
    // <div className={isDesktop ? "flexrow" : "flexcolumn"}>
    isDesktop ? (
      <div className="flexrow">
        <div className="container">
          <h1>Registrieren</h1>
          <RegisterForm1 />
        </div>
        <SideBox
          headline="Hallo!"
          subtitle={["hier ganz viel Begrüßungstext", "mehrere Zeilen", "sogar"]}
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
      </div>
    ) : (
      <>
        <div className="flexcolumn">
          <div className="container">
            <h1>Registrieren</h1>
            <RegisterForm1 />
          </div>
        </div>
        <div className="lower">
          <p>Neu? Stattdessen einloggen?</p>
          <Button label="LOGIN" type="button" onClick={() => navigate("/login")} />
        </div>
      </>
    )
  );
}

export function Register2() {
  return (
    <div className="container">
      <h1>Registrieren</h1>
      <RegisterForm2 />
    </div>
  );
}

export function Register3() {
  return (
    <div className="container">
      <h1>Registrieren</h1>
      <RegisterForm3 />
    </div>
  );
}
