import { Outlet, useNavigate } from "react-router-dom";
import {
  RegisterForm1,
  RegisterForm2,
  RegisterForm3,
} from "../components/Form";
import { makeStyles, useTheme } from "@material-ui/core";

import Button from "../components/Button";
import { SideBox } from "../components/SideBox";
import useViewport from "../hooks/useViewport";

export default function Register() {
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
            textColor={theme.palette.primary.main}
            label="Login"
            type="button"
            onClick={() => navigate("/login")}
            isCapitalized
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
