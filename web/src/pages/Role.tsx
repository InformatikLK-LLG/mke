import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  makeStyles,
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Privilege } from "../hooks/useAuth";
import { User } from "./User";
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
        <Accordion square className={classes.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
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
