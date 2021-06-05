import { Outlet, useNavigate } from "react-router-dom";
import {
  RegisterForm1,
  RegisterForm2,
  RegisterForm3,
} from "../components/Form";

import Button from "../components/Button";
import { SideBox } from "../components/SideBox";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "react-router";
import useViewport from "../hooks/useViewport";

export default function Register() {
  const auth = useAuth();
  const navigate = useNavigate();
  const inviteCode = new URLSearchParams(useLocation().search).get(
    "inviteCode"
  );

  useEffect(() => {
    async function skipFirstStep() {
      if (inviteCode) {
        const invite = await auth.skipFirstRegisterStep(inviteCode);
        if (invite)
          navigate("./1", { state: { _register_1: { email: invite.email } } });
      }
    }

    skipFirstStep();
  }, [auth, navigate, inviteCode]);

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
          <Button
            label="LOGIN"
            type="button"
            onClick={() => navigate("/login")}
          />
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
