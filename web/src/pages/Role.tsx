import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  makeStyles,
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Privilege } from "../hooks/useAuth";
import { User } from "./User";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import usePrivileges from "../hooks/usePrivileges";

const useStyles = makeStyles({
  accordion: {
    width: "100%",
    padding: "0.5em 0",
  },
});

export function CreateRole({ user }: { user: User }) {
  const classes = useStyles();
  const { data } = usePrivileges(user);
  const categories: Array<{ name: string; read: boolean; write: boolean }> = [];
  const privileges: Privilege[] = data?.data || [];

  privileges.forEach((privilege) => {
    const [name, kindOfPrivilege] = privilege.id.split("_");
    const i = categories.findIndex(
      (value) => value.name === name.toLowerCase()
    );

    if (i === -1) {
      categories.push({
        name: name.toLowerCase(),
        read: kindOfPrivilege === "READ",
        write: kindOfPrivilege === "WRITE",
      });
    }

    if (i !== -1) {
      let tempPrivilege = categories[i];
      if (kindOfPrivilege === "READ") tempPrivilege.read = true;
      else if (kindOfPrivilege === "WRITE") tempPrivilege.write = true;
      categories[i] = tempPrivilege;
    }
  });

  return (
    <>
      {categories.map((category) => (
        <Accordion square className={classes.accordion} key={category.name}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container item xs>
              <Grid item>
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </Grid>
              <Grid
                item
                container
                justifyContent="flex-end"
                alignItems="center"
                xs
              >
                {category.read && (
                  <Grid item>
                    <InputAdornment position="end">
                      <FontAwesomeIcon icon={faEye} />
                    </InputAdornment>
                  </Grid>
                )}
                {category.write && (
                  <Grid item>
                    <InputAdornment position="end">
                      <FontAwesomeIcon icon={faPen} />
                    </InputAdornment>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={<Checkbox checked={category.read} disabled={true} />}
              label="READ"
            />
            <FormControlLabel
              control={<Checkbox checked={category.write} disabled={true} />}
              label="WRITE"
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
