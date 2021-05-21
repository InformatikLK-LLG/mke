import { SideBox } from "../components/SideBox";
import useViewport from "../hooks/useViewport";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { LoginForm, RegisterForm1, RegisterForm2, RegisterForm3 } from "../components/Form";

export default function Login() {
  const width = useViewport();
  const navigate = useNavigate();

  return (
    <div className="flexrow">
      {width > 520 ? (
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
        <div className="" />
      )}
      <div className="container">
        <LoginForm />
      </div>
    </div>
  );
}
