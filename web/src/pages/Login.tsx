import { SideBox } from "../components/SideBox";
import useViewport from "../hooks/useViewport";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/Form";

export default function Login() {
  const width = useViewport();
  const navigate = useNavigate();
  const isDesktop = width > 730;

  return (
    <div className={isDesktop ? "flexrow" : "flexcolumn reverse"}>
      {isDesktop ? (
        <SideBox
          headline="Willkommen zurück"
          subtitle={["hier ganz viel Begrüßungstext", "mehrere Zeilen", "sogar"]}
          Button={
            <Button
              type={"button"}
              label={"REGISTRIEREN"}
              onClick={() => {
                navigate("/register");
              }}
            />
          }
          color="blue"
          size="smol"
        />
      ) : (
        <div className="mobile lower">
          <p>Neu? Stattdessen registrieren?</p>
          <Button label="REGISTRIEREN" type="button" onClick={() => navigate("/register")} />
        </div>
      )}
      <div className="container">
        <h1>Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
