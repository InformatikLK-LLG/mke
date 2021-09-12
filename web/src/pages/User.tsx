import { BaseSyntheticEvent, useEffect, useState } from "react";
import { Controller, UseFormGetValues, useForm } from "react-hook-form";
import {
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  Switch,
  TextField,
  useTheme,
} from "@material-ui/core";
import Form, { EmailInputField, OrderType } from "../components/Form";
import {
  FormState,
  RecursivePartial,
  RenderInput,
  useButtonStyles,
  useInputStyles,
} from "./Institution";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Table, { TableHeaders } from "../components/Table";
import axios, { AxiosResponse } from "axios";
import { useHeader, useSnackbar } from "../Wrapper";
import useUsers, { UserSearchParams } from "../hooks/useUsers";

import Autocomplete from "../components/Autocomplete";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../components/Loading";
import PageNotFound from "./PageNotFound";
import { RoleType } from "../hooks/useAuth";
import { ViewPrivileges } from "./Role";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faUserTag } from "@fortawesome/free-solid-svg-icons";
import { useDetailsStyles } from "../components/InstitutionDetails";
import useEventListener from "@use-it/event-listener";
import { useQueryClient } from "react-query";
import useRoles from "../hooks/useRoles";
import useUser from "../hooks/useUser";

export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Array<RoleType>;
};

export default function User() {
  return <Outlet />;
}

export function Users() {
  const {
    data: userData,
    isLoading: userIsLoading,
    setSearchParams: setUserSearchParams,
  } = useUsers();
  const { data: roleData, isLoading: roleIsLoading } = useRoles();
  const navigate = useNavigate();
  const tableHeaders: TableHeaders<UserType> = {
    firstName: { label: "Vorname", width: 1 },
    lastName: { label: "Nachname", width: 1 },
    email: { label: "Email", width: 1 },
    roles: {
      label: "Rollen",
      width: 1,
      format: (value: Array<RoleType>) => (
        <>
          {value
            .map((role) => role.name)
            .sort()
            .join(", ")}
        </>
      ),
    },
  };

  async function search(parameter?: keyof UserSearchParams, query?: string) {
    setUserSearchParams(
      (value) =>
        parameter &&
        (value ? { ...value, [parameter]: query } : { [parameter]: query })
    );
  }

  const searchParams: Array<
    {
      [key in keyof UserSearchParams]:
        | "string"
        | "number"
        | { data: Array<string> | undefined; isLoading: boolean };
    }
  > = [
    { firstName: "string" },
    { lastName: "string" },
    { email: "string" },
    {
      roles: {
        data: roleData?.map((role) => role.name),
        isLoading: roleIsLoading,
      },
    },
  ];

  return (
    <div className="container">
      <Table
        rows={userData || []}
        tableHeaders={tableHeaders}
        isLoading={userIsLoading}
        onRowClick={(row) => navigate(`./${row.id}`)}
        sort={["Vorname", "Nachname", "Email", "Rollen"]}
        search={search}
        searchParams={searchParams}
      />
    </div>
  );
}

export function UserDetails({ data }: { data: UserType }) {
  const detailsStyles = useDetailsStyles();
  const header = useHeader();

  useEffect(() => {
    header.setHeader(`${data.firstName} ${data.lastName}`);
  }, [data, header]);

  return (
    <div className={detailsStyles.enclosure}>
      <div className={detailsStyles.section}>
        <UpdateUserForm data={data} />
      </div>
      <Divider
        style={{ width: "80%" }}
        classes={{ root: detailsStyles.divider }}
      />
      <div className={detailsStyles.section}>
        <h3
          style={{ alignSelf: "flex-start" }}
        >{`Rechte — ${data.firstName} ${data.lastName}`}</h3>
        <ViewPrivileges user={data} />
      </div>
    </div>
  );
}

export function ViewUserDetails() {
  const { userId } = useParams();
  const { data, isLoading } = useUser(Number(userId));
  return isLoading ? (
    <Loading />
  ) : data ? (
    <UserDetails data={data} />
  ) : (
    <PageNotFound />
  );
}

export function UpdateUserForm({ data }: { data?: UserType }) {
  const queryClient = useQueryClient();
  const userStyles = useDetailsStyles();
  const navigate = useNavigate();
  const { setMessage, setSnackbarOpen } = useSnackbar();

  const updateData = async (data?: UserType) => {
    try {
      const response = await axios.put<UserType>(
        `http://localhost:8080/user/${data?.id}`,
        data
      );
      if (response.status === 200) {
        queryClient.invalidateQueries("users");
        queryClient.invalidateQueries("user");
        setMessage("Erfolgreich aktualisiert.");
      }
      return response;
    } catch (error) {
      setMessage(error.response.data.message);
      throw error;
    } finally {
      setSnackbarOpen(true);
    }
  };
  const toggleLabel = (
    disabled: boolean,
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
    getValues: UseFormGetValues<UserType>
  ) => {
    const editableToggle = (
      <Grid item container xs={12} justifyContent="flex-end">
        <FormControlLabel
          control={
            <Switch
              checked={!disabled}
              onChange={async () => {
                if (!disabled) {
                  try {
                    await updateData(getValues());
                    setDisabled(true);
                  } catch (error) {
                    setDisabled(false);
                  }
                } else setDisabled((value) => !value);
              }}
              name="toggleDisabled"
              color="primary"
            />
          }
          label="Bearbeiten"
          labelPlacement="start"
          className={userStyles.toggleLabel}
        />
      </Grid>
    );
    return editableToggle;
  };

  return (
    <UserForm
      onSubmit={async (data) => {
        try {
          const response = await updateData(data);
          navigate("/users");
          return response;
        } catch (error) {
          throw error;
        }
      }}
      defaultValues={data}
      toggleLabel={toggleLabel}
      defaultDisabled
    />
  );
}

export function UserForm({
  defaultValues,
  onSubmit,
  toggleLabel,
  defaultDisabled = false,
}: {
  defaultValues?: RecursivePartial<UserType>;
  onSubmit: (
    data: UserType,
    event?: BaseSyntheticEvent
  ) => Promise<AxiosResponse<UserType | Array<UserType>>>;
  toggleLabel?: (
    disabled: boolean,
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
    getValues: UseFormGetValues<UserType>
  ) => JSX.Element;
  defaultDisabled?: boolean;
}) {
  const defaultUser: UserType = {
    id: defaultValues?.id || "",
    firstName: defaultValues?.firstName || "",
    lastName: defaultValues?.lastName || "",
    email: defaultValues?.email || "",
    roles: defaultValues?.roles || [],
  };

  const {
    handleSubmit,
    setValue,
    control,
    watch,
    getValues,
    formState: { errors, isValid },
    clearErrors,
    trigger,
  } = useForm<UserType>({
    mode: "onChange",
    defaultValues: defaultUser,
  });

  const theme = useTheme();
  const formInput = useInputStyles();
  const formButton = useButtonStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(defaultDisabled);
  const { setMessage, setSnackbarOpen } = useSnackbar();
  const { data: availableRoles } = useRoles();

  const formState: FormState<UserType> = {
    clearErrors,
    control,
    errors,
    formInput,
    watch,
    setValue,
  };

  const order: OrderType = {
    xs: [1, 2, 3, 4, 5],
    md: [1, 2, 3, 4, 5],
    lg: [1, 2, 3, 4, 5],
  };

  const onKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "s" && event.altKey) {
      event.preventDefault();
      trigger();
      if (isValid) {
        onSubmit(getValues());
      }
    }
  };

  useEventListener("keydown", onKeyDown);

  const inputs = [
    toggleLabel ? toggleLabel(disabled, setDisabled, getValues) : <></>,
    <Grid item xs={12} md={6} lg={6}>
      {RenderInput({
        name: "firstName",
        placeholder: "Vorname",
        required: "Vorname muss angegeben werden",
        autofocus: true,
        icon: faUser,
        autoComplete: "given-name",
        disabled,
        formState,
      })}
    </Grid>,
    <Grid item xs={12} md={6} lg={6}>
      {RenderInput({
        name: "lastName",
        placeholder: "Nachname",
        required: "Nachname muss angegeben werden",
        icon: faUser,
        autoComplete: "family-name",
        disabled,
        formState,
      })}
    </Grid>,
    <Grid item xs={12} md={6} lg={6}>
      {<EmailInputField formState={formState} disabled={disabled} />}
    </Grid>,
    <Grid item xs={12} md={6} lg={6}>
      <Controller
        control={control}
        name="roles"
        render={({ field }) => (
          <Autocomplete
            data={availableRoles || []}
            onChange={(event, values) => {
              field.onChange(values);
            }}
            inputField={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faUserTag} />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  className: "",
                }}
                className={formInput.input}
                size="small"
                label="Rollen"
              />
            )}
            disabled={disabled}
            renderText={(option) => option.name}
            value={field.value}
            loading={isLoading}
            loadingText="Lade Daten"
          />
        )}
      />
    </Grid>,
  ];
  return (
    <Form
      button={
        <Button
          type="submit"
          label="Erstellen"
          buttonStyle={formButton}
          textColor="white"
          backgroundColor={theme.palette.primary.main}
          isLoading={isLoading}
          disabled={disabled}
        />
      }
      inputs={inputs}
      maxWidth="200ch"
      onSubmit={handleSubmit(async (data, event) => {
        setIsLoading(true);
        try {
          const response = await onSubmit(data, event);
          if (response.status === 200) {
            setMessage("Erfolgreich gespeichert.");
            setSnackbarOpen(true);
          }
        } catch (error) {
          setMessage(error.response.data.message);
          setSnackbarOpen(true);
        } finally {
          setIsLoading(false);
        }
      })}
      order={order}
    />
  );
}
