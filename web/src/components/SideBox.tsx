import "../styles/SideBox.css";
import { useNavigate } from "react-router-dom";

type SideBoxProps = {
  headline: string;
  subtitle: string[];
  Button: JSX.Element;
  color?: "blue" | "";
  size?: "normal" | "smol" | "big";
};

export function SideBox({ headline, subtitle, Button, color = "", size = "normal" }: SideBoxProps) {
  const navigate = useNavigate();

  return (
    <div className={`sideBox ${color} ${size}`}>
      <h2>{headline}</h2>
      <span>
        {subtitle.map((line, index) => {
          return <p key={index}>{line}</p>;
        })}
      </span>
      <div>{Button}</div>
    </div>
  );
}
