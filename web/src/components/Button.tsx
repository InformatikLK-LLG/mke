export type Button = JSX.Element;

export function Button({
  type,
  className = "",
  label,
  onClick,
}: {
  type: "button" | "submit" | "reset" | undefined;
  className?: string;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}): Button {
  return (
    <button type={type} className={"button" + className} onClick={onClick}>
      {label}
    </button>
  );
}
