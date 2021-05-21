import { useNavigate } from "react-router-dom";

type SideBoxProps = {
  headline: string;
  subtitle: string[];
  Button: JSX.Element;
};

export function SideBox({ headline, subtitle, Button }: SideBoxProps) {
  const navigate = useNavigate();

  return (
    <div>
      <h2>{headline}</h2>
      <div>
        {subtitle.map((line, index) => {
          return <p key={index}>{line}</p>;
        })}
      </div>
      <div>{Button}</div>
    </div>
  );
}
