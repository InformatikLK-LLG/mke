export type ButtonProps = JSX.Element;

export default function Button({
  type,
  className = "",
  label,
  onClick,
}: {
  type: "button" | "submit" | "reset" | undefined;
  className?: string;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}): ButtonProps {
  return (
    <button type={type} className={"button " + className} onClick={onClick}>
      {label}
    </button>
  );
}
