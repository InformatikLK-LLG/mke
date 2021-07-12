import BetterButton from "@material-ui/core/Button";
import { CircularProgress } from "@material-ui/core";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles: (props: { backgroundColor: string; textColor: string }) => {
  button: string;
} = makeStyles({
  button: {
    backgroundColor: ({ backgroundColor }) => backgroundColor,
    color: ({ textColor }) => textColor,
    transition: "none",
    fontSize: "1em",
    padding: "0.5em 2em",
    borderRadius: "30px",
    fontFamily:
      '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif',
    "&:hover": {
      boxShadow: "0 0 5px #444444",
      filter: "brightness(1.05)",
      backgroundColor: ({ backgroundColor }) => backgroundColor,
    },
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 5px var(--border)",
    },
  },
});

const useProgressStyles = makeStyles({
  wrapper: {
    position: "relative",
  },
  progress: {
    color: "var(--highlighting)",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: 6,
    marginLeft: -12,
  },
});

export default function Button({
  type,
  textColor = "white",
  backgroundColor = "primary",
  label,
  onClick,
  buttonStyle,
  isCapitalized = false,
  disabled = false,
  isLoading,
}: {
  type: "button" | "submit" | "reset" | undefined;
  textColor?: "primary" | "secondary" | string;
  backgroundColor?: "primary" | "secondary" | string;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  buttonStyle?: ClassNameMap<"button">;
  isCapitalized?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}): JSX.Element {
  const classes = useStyles({
    textColor: textColor,
    backgroundColor: backgroundColor,
  });
  const progressClasses = useProgressStyles();

  return (
    <div className={progressClasses.wrapper}>
      <BetterButton
        type={type}
        className={`${classes.button} ${buttonStyle ? buttonStyle.button : ""}`}
        onClick={onClick}
        variant="contained"
        style={{ textTransform: isCapitalized ? "uppercase" : "none" }}
        disableRipple
        disableElevation
        disabled={disabled || isLoading}
      >
        {label}
      </BetterButton>
      {isLoading && (
        <CircularProgress size={24} className={progressClasses.progress} />
      )}
    </div>
  );
}
