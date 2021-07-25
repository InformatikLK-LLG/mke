import Button from "../components/Button";
import { LoginForm } from "../components/Form";
import { SideBox } from "../components/SideBox";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useNavigate } from "react-router-dom";
import useTheme from "@material-ui/core/styles/useTheme";
import useViewport from "../hooks/useViewport";

export default function Login() {
  const width = useViewport();
  const navigate = useNavigate();
  const isDesktop = width > 730;
  const theme = useTheme();
  const useStyle = makeStyles({ button: { border: "1px solid white" } });
  const buttonStyle = useStyle();

  return (
    <div className={isDesktop ? "flexrow" : "flexcolumn reverse"}>
      {isDesktop ? (
        <SideBox
          headline="Willkommen zurück"
          subtitle={[
            "hier ganz viel Begrüßungstext",
            "mehrere Zeilen",
            "sogar",
          ]}
          Button={
            <Button
              backgroundColor={theme.palette.primary.main}
              textColor={"white"}
              type={"button"}
              label={"Registrieren"}
              onClick={() => {
                navigate("/register");
              }}
              buttonStyle={buttonStyle}
              isCapitalized
            />
          }
          color="blue"
          size="smol"
        />
      ) : (
        <div className="mobile lower">
          <p>Neu? Stattdessen registrieren?</p>
          <Button
            label="Registrieren"
            type="button"
            onClick={() => navigate("/register")}
            textColor="primary"
          />
        </div>
      )}
      <div className="container">
        <h1>Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
