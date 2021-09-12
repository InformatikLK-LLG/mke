import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  Switch,
  TextField,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { PrivilegeCategory, PrivilegeType, RoleType } from "../hooks/useAuth";
import Table, { TableHeaders } from "../components/Table";
import { useEffect, useState } from "react";
import { useHeader, useSnackbar } from "../Wrapper";
import useRoles, { RoleSearchParams } from "../hooks/useRoles";

import Button from "../components/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../components/Loading";
import PageNotFound from "./PageNotFound";
import { UserType } from "./User";
import axios from "axios";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useDetailsStyles } from "../components/InstitutionDetails";
import usePrivileges from "../hooks/usePrivileges";
import usePrivilegesOfUser from "../hooks/usePrivilegesOfUser";
import useRole from "../hooks/useRole";

const useStyles = makeStyles({
  accordion: {
    width: "100%",
    padding: "0.5em 0",
  },
});

export default function Role() {
  return <Outlet />;
}

export function Roles() {
  const navigate = useNavigate();
  const { data, isLoading, setSearchParams } = useRoles();

  const tableHeaders: TableHeaders<RoleType> = {
    id: { label: "Name", width: 1 },
  };

  const searchParams: Array<{ [key in keyof RoleSearchParams]: "string" }> = [
    {
      id: "string",
    },
  ];

  const search = async (parameter?: "id", query?: string) =>
    setSearchParams(
      (value) =>
        parameter &&
        (value ? { ...value, [parameter]: query } : { [parameter]: query })
    );

  return (
    <div className="container">
      <Table
        rows={data || []}
        tableHeaders={tableHeaders}
        onRowClick={(row) => navigate(`./${row.id}`)}
        isLoading={isLoading}
        search={search}
        searchParams={searchParams}
        sort={["Name"]}
      />
    </div>
  );
}

export function ViewRoleDetails() {
  const { roleId } = useParams();
  const { data, isLoading } = useRole(roleId);
  return isLoading ? (
    <Loading />
  ) : data ? (
    <RoleDetails data={data} />
  ) : (
    <PageNotFound />
  );
}

export function RoleDetails({ data }: { data: RoleType }) {
  const header = useHeader();

  useEffect(() => {
    header.setHeader(`${data.id}`);
  }, [data, header]);

  return (
    <div className="">
      <UpdateRole data={data} />
    </div>
  );
}

function UpdateRole({ data }: { data: RoleType }) {
  const classes = useStyles();
  const detailsStyles = useDetailsStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const { data: privilegeData } = usePrivileges();
  // we don't change privilges, and if data changes, the ui really should re-render
  // eslint-disable-next-line
  const privileges = data.privileges || [];
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<
    Array<{ id: PrivilegeCategory; read?: boolean; write?: boolean }>
  >([]);

  const selectedPrivileges: Array<PrivilegeType> = [];
  const [isLoading, setIsLoading] = useState(false);
  const { setMessage, setSnackbarOpen } = useSnackbar();

  const [isDisabled, setIsDisabled] = useState(true);

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
      <FormControlLabel
        control={
          <Switch
            checked={!isDisabled}
            onChange={async () => {
              if (!isDisabled) {
                try {
                  await console.log("");
                  setIsDisabled(true);
                } catch (error) {
                  setIsDisabled(false);
                }
              } else setIsDisabled((value) => !value);
            }}
            name="toggleDisabled"
            color="primary"
          />
        }
        label="Bearbeiten"
        labelPlacement="start"
        className={detailsStyles.toggleLabel}
      />
      <TextField
        disabled={isDisabled}
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
                        disabled={isDisabled}
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
                      disabled={isDisabled}
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
                      disabled={isDisabled}
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
        disabled={isDisabled}
        label="Erstellen"
        type="button"
        isLoading={isLoading}
        backgroundColor={theme.palette.primary.main}
        onClick={async () => {
          categories.forEach((category) => {
            category.read &&
              selectedPrivileges.push({ id: `${category.id}_READ` });
            category.write &&
              selectedPrivileges.push({ id: `${category.id}_WRITE` });
          });
          try {
            setIsLoading(true);
            const response = await axios.post<RoleType>(
              "http://localhost:8080/role",
              {
                id: name,
                privileges: selectedPrivileges,
              }
            );
            if (response.status === 200) {
              setMessage("Erfolgreich gespeichert.");
              setSnackbarOpen(true);
              navigate("/roles");
            }
            return response;
          } catch (error) {
            throw error;
          } finally {
            setIsLoading(false);
          }
        }}
      />
    </div>
  );
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
  const navigate = useNavigate();
  const { data } = usePrivileges();
  // we don't change privilges, and if data changes, the ui really should re-render
  // eslint-disable-next-line
  const privileges = data || [];
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<
    Array<{ id: PrivilegeCategory; read?: boolean; write?: boolean }>
  >([]);

  const selectedPrivileges: Array<PrivilegeType> = [];
  const [isLoading, setIsLoading] = useState(false);
  const { setMessage, setSnackbarOpen } = useSnackbar();

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
        isLoading={isLoading}
        backgroundColor={theme.palette.primary.main}
        onClick={async () => {
          categories.forEach((category) => {
            category.read &&
              selectedPrivileges.push({ id: `${category.id}_READ` });
            category.write &&
              selectedPrivileges.push({ id: `${category.id}_WRITE` });
          });
          try {
            setIsLoading(true);
            const response = await axios.post<RoleType>(
              "http://localhost:8080/role",
              {
                id: name,
                privileges: selectedPrivileges,
              }
            );
            if (response.status === 200) {
              setMessage("Erfolgreich gespeichert.");
              setSnackbarOpen(true);
              navigate("/roles");
            }
            return response;
          } catch (error) {
            throw error;
          } finally {
            setIsLoading(false);
          }
        }}
      />
    </div>
  );
}
