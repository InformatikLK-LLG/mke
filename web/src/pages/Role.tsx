import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import { PrivilegeCategory, PrivilegeType, RoleType } from "../hooks/useAuth";
import { useEffect, useState } from "react";

import Button from "../components/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Outlet } from "react-router-dom";
import { UserType } from "./User";
import axios from "axios";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import usePrivileges from "../hooks/usePrivileges";
import usePrivilegesOfUser from "../hooks/usePrivilegesOfUser";

const useStyles = makeStyles({
  accordion: {
    width: "100%",
    padding: "0.5em 0",
  },
});

export default function Role() {
  return <Outlet />;
}

export function ViewPrivileges({ user }: { user: UserType }) {
  const classes = useStyles();
  const { data } = usePrivilegesOfUser(user);
  const categories: Array<{ name: string; read: boolean; write: boolean }> = [];
  const privileges: PrivilegeType[] = data || [];

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

export function CreateRole() {
  const classes = useStyles();
  const theme = useTheme();
  const { data } = usePrivileges();
  // we don't change privilges, and if data changes, the ui really should re-render
  // eslint-disable-next-line
  const privileges = data || [];
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<
    Array<{ id: PrivilegeCategory; read?: boolean; write?: boolean }>
  >([]);

  const selectedPrivileges: Array<PrivilegeType> = [];

  useEffect(() => {
    privileges.forEach((privilege) => {
      const [name, kindOfPrivilege] = privilege.id.split("_") as [
        PrivilegeCategory,
        "READ" | "WRITE"
      ];

      setCategories((categories) => {
        const i = categories.findIndex((value) => value.id === name);

        if (i === -1) {
          return categories.concat({
            id: name,
            read: kindOfPrivilege === "READ" ? false : undefined,
            write: kindOfPrivilege === "WRITE" ? false : undefined,
          });
        }

        let tempPrivilege = categories[i];
        if (kindOfPrivilege === "READ") tempPrivilege.read = false;
        else if (kindOfPrivilege === "WRITE") tempPrivilege.write = false;
        categories[i] = tempPrivilege;
        return categories.map((category, index) =>
          index === i ? tempPrivilege : category
        );
      });
    });
  }, [privileges]);

  return (
    <div className="">
      <TextField
        label="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <div>
        {categories.map((category, index) => (
          <Accordion square className={classes.accordion} key={category.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid container item xs>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(event) =>
                          setCategories((categories) =>
                            categories.map((category, j) =>
                              index === j
                                ? {
                                    ...category,
                                    read:
                                      category.read !== undefined
                                        ? event.target.checked
                                        : undefined,
                                    write:
                                      category.write !== undefined
                                        ? event.target.checked
                                        : undefined,
                                  }
                                : category
                            )
                          )
                        }
                      />
                    }
                    onClick={(event) => event.stopPropagation()}
                    checked={
                      (category.read || category.read === undefined) &&
                      (category.write || category.write === undefined)
                    }
                    onFocus={(event) => event.stopPropagation()}
                    label={
                      category.id.charAt(0) + category.id.slice(1).toLowerCase()
                    }
                  />
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
              {category.read !== undefined && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={category.read}
                      onClick={() =>
                        setCategories((categories) =>
                          categories.map((category, j) =>
                            index === j
                              ? { ...category, read: !category.read }
                              : category
                          )
                        )
                      }
                    />
                  }
                  label="READ"
                />
              )}
              {category.write !== undefined && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={category.write}
                      onClick={() =>
                        setCategories((categories) =>
                          categories.map((category, j) =>
                            index === j
                              ? { ...category, write: !category.write }
                              : category
                          )
                        )
                      }
                    />
                  }
                  label="WRITE"
                />
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
      <Button
        label="Erstellen"
        type="button"
        backgroundColor={theme.palette.primary.main}
        onClick={async () => {
          categories.forEach((category) => {
            category.read &&
              selectedPrivileges.push({ id: `${category.id}_READ` });
            category.write &&
              selectedPrivileges.push({ id: `${category.id}_WRITE` });
          });
          try {
            const blub = await axios.post<RoleType>(
              "http://localhost:8080/role",
              {
                id: name,
                privileges: selectedPrivileges,
              }
            );
          } catch (error) {
            console.log(error);
          }
        }}
      />
    </div>
  );
}
