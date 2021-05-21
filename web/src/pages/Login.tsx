import { SideBox } from "../components/Sidebox";
import useViewport from "../hooks/useViewport";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

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
              type="button"
              label="REGISTRIEREN"
              onClick={() => {
                navigate("/register");
              }}
            />
          }
        />
      ) : (
        <div className="" />
      )}
    </div>
  );
}
