import {
  LinearProgress,
  Theme,
  createStyles,
  makeStyles,
  useTheme,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  })
);
export default function Loading() {
  const theme = useTheme();
  const classes = useStyles(theme);
  return <LinearProgress className={classes.root} color={"primary"} />;
}
