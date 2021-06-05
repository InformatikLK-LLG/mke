import { Outlet, useNavigate } from "react-router-dom";
import {
  RegisterForm1,
  RegisterForm2,
  RegisterForm3,
} from "../components/Form";
<<<<<<< HEAD
import { makeStyles, useTheme } from "@material-ui/core";
=======
>>>>>>> 69d18bc (Add direct link with secure, unique invite code)

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
  const theme = useTheme();
  const useStyles = makeStyles({ button: { border: "1px solid white" } });
  const buttonStyle = useStyles();

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
              label={"Login"}
              onClick={() => {
                navigate("/login");
              }}
              backgroundColor={theme.palette.primary.main}
              buttonStyle={buttonStyle}
              isCapitalized
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
<<<<<<< HEAD
            textColor={theme.palette.primary.main}
            label="Login"
            type="button"
            onClick={() => navigate("/login")}
            isCapitalized
=======
            label="LOGIN"
            type="button"
            onClick={() => navigate("/login")}
>>>>>>> 69d18bc (Add direct link with secure, unique invite code)
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
