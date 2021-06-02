import BetterButton from "@material-ui/core/Button";

export default function Button({
  type,
  className = "",
  color,
  label,
  onClick,
}: {
  type: "button" | "submit" | "reset" | undefined;
  className?: string;
  color: "primary" | "secondary" | any;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}): JSX.Element {
  return (
    <BetterButton
      type={type}
      className={"button " + className}
      onClick={onClick}
      variant="contained"
      color={color}
    >
      {label}
    </BetterButton>
  );
}
