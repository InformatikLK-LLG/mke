import { BaseSyntheticEvent, useEffect, useState } from "react";
import { Controller, UseFormGetValues, useForm } from "react-hook-form";
import {
  CreateInstitutionForm,
  FormInstitutionType,
  FormState,
  RecursivePartial,
  RenderInput,
  useButtonStyles,
  useInputStyles,
} from "./Institution";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Switch,
  Theme,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import Form, { EmailInputField, OrderType } from "../components/Form";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Table, { TableHeaders } from "../components/Table";
import axios, { AxiosError, AxiosResponse } from "axios";
import { hasInstitutionWrite, useAuth } from "../hooks/useAuth";
import useCustomers, { CustomerSearchParams } from "../hooks/useCustomers";

import { Autocomplete } from "@material-ui/lab";
import Button from "../components/Button";
import Loading from "../components/Loading";
import PageNotFound from "./PageNotFound";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faUniversity } from "@fortawesome/free-solid-svg-icons";
import useCustomer from "../hooks/useCustomer";
import { useDetailsStyles } from "../components/InstitutionDetails";
import useEventListener from "@use-it/event-listener";
import { useQueryClient } from "react-query";
import { useSnackbar } from "../Wrapper";

export type CustomerType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  businessPhone: string;
  institution: { name: string; id: string };
};

export const useInputFields = makeStyles((theme: Theme) => ({
  firstName: {},
  lastName: {},
  email: {},
  mobilePhone: {},
  businessPhone: {},
  institution: {},
}));

export default function Customer() {
  return <Outlet />;
}

export function Customers() {
  return (
    <div className="container">
      <CustomerTable />
    </div>
  );
}

export function CustomerTable({ instCode }: { instCode?: string }) {
  const tableHeaders: TableHeaders<CustomerType> = {
    firstName: { label: "Vorname", width: 1 },
    lastName: { label: "Nachname", width: 1 },
    email: { label: "Email", width: 1 },
    mobilePhone: { label: "Handynummer", width: 1 },
    businessPhone: { label: "Telefonnummer dienstlich", width: 1 },
  };
  const { data, isLoading, setSearchParams } = useCustomers(instCode);
  const navigate = useNavigate();
  const search = (searchParam?: keyof CustomerSearchParams, query?: string) => {
    setSearchParams(
      (value) =>
        searchParam &&
        (value ? { ...value, [searchParam]: query } : { [searchParam]: query })
    );
  };

  const searchParams: Array<{
    [key in keyof CustomerSearchParams]: "string" | "number";
  }> = [{ firstName: "string" }, { lastName: "string" }];

  return (
    <Table
      tableHeaders={tableHeaders}
      rows={data || []}
      sort={["Vorname", "Nachname", "Email"]}
      onRowClick={(row) => navigate(`/customers/${row.id}`)}
      isLoading={isLoading}
      search={search}
      searchParams={searchParams}
    />
  );
}

export function CreateCustomer() {
  return <CreateCustomerForm />;
}

export function CustomerDetails({ data }: { data: CustomerType }) {
  return (
    <div className="container">
      <UpdateCustomerForm data={data} />
    </div>
  );
}

export function CreateCustomerForm({
  defaultCustomer,
  onSubmit,
}: {
  defaultCustomer?: RecursivePartial<CustomerType>;
  onSubmit?: (
    data: CustomerType,
    event?: BaseSyntheticEvent
  ) => Promise<AxiosResponse<CustomerType>>;
}) {
  const navigate = useNavigate();
  const { setMessage, setSnackbarOpen } = useSnackbar();

  const submit: (
    data: CustomerType,
    event?: BaseSyntheticEvent
  ) => Promise<AxiosResponse<CustomerType>> =
    onSubmit ||
    (async (data, event) => {
      try {
        const response = await axios.post<CustomerType>(
          "http://localhost:8080/customer",
          data
        );
        if (response.status === 200) {
          setMessage("Erfolgreich gespeichert.");
          setSnackbarOpen(true);
          navigate("/customers");
        }
        return response;
      } catch (error) {
        throw error;
      }
    });

  return <CustomerForm onSubmit={submit} defaultValues={defaultCustomer} />;
}

export function UpdateCustomerForm({ data }: { data?: CustomerType }) {
  const queryClient = useQueryClient();
  const detailsStyles = useDetailsStyles();
  const navigate = useNavigate();
  const { setMessage, setSnackbarOpen } = useSnackbar();
  const updateData = async (data?: CustomerType) => {
    try {
      const response = await axios.put<CustomerType>(
        "http://localhost:8080/customer",
        data
      );
      if (response.status === 200) {
        queryClient.invalidateQueries("customer");
        queryClient.invalidateQueries("customers");
        setMessage("Erfolgreich aktualisiert.");
      }
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data.message);
      }
      throw error;
    } finally {
      setSnackbarOpen(true);
    }
  };
  const toggleLabel = (
    disabled: boolean,
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
    getValues: UseFormGetValues<CustomerType>
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
          className={detailsStyles.toggleLabel}
        />
      </Grid>
    );
    return editableToggle;
  };
  return (
    <CustomerForm
      onSubmit={async (data) => {
        try {
          const response = await updateData(data);
          navigate("/customers");
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

export function CustomerForm({
  defaultValues,
  onSubmit,
  toggleLabel,
  defaultDisabled = false,
}: {
  defaultValues?: RecursivePartial<CustomerType>;
  onSubmit: (
    data: CustomerType,
    event?: BaseSyntheticEvent
  ) => Promise<AxiosResponse<CustomerType>>;
  toggleLabel?: (
    disabled: boolean,
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
    getValues: UseFormGetValues<CustomerType>
  ) => JSX.Element;
  defaultDisabled?: boolean;
}) {
  const theme = useTheme();
  const inputFields = useInputFields(theme);
  const defaultCustomer = {
    id: defaultValues?.id || "",
    firstName: defaultValues?.firstName || "",
    lastName: defaultValues?.lastName || "",
    email: defaultValues?.email || "",
    mobilePhone: defaultValues?.mobilePhone || "",
    businessPhone: defaultValues?.businessPhone || "",
    institution: defaultValues?.institution || {
      id: "",
      name: "",
    },
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
  } = useForm<CustomerType>({
    mode: "onChange",
    defaultValues: defaultCustomer,
  });

  const formInput = useInputStyles();
  const formButton = useButtonStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(defaultDisabled);
  const [options, setOptions] =
    useState<Array<{ name: string; id?: string }>>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setSnackbarOpen, setMessage } = useSnackbar();
  const { user } = useAuth();

  const institution = watch("institution");
  const formState: FormState<CustomerType> = {
    clearErrors,
    control,
    errors,
    formInput,
    watch,
    setValue,
  };

  const order: OrderType = {
    xs: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    md: [1, 2, 3, 5, 6, 7, 8, 4, 9],
    lg: [1, 2, 3, 5, 6, 4, 7, 8, 9],
  };
  const fetchData = async () => {
    try {
      const response = await axios.get<Array<FormInstitutionType>>(
        "http://localhost:8080/institution"
      );
      const data = response.data.map((dataSingular) => {
        return {
          name: dataSingular.name,
          id: dataSingular.id,
        };
      });
      setOptions(data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    <Grid item xs={12} md={6} lg={6} className={inputFields.firstName}>
      {RenderInput({
        name: "firstName",
        placeholder: "Vorname",
        autoComplete: "given-name",
        required: "Vorname muss angegeben werden",
        autofocus: true,
        icon: faEdit,
        disabled,
        formState,
      })}
    </Grid>,

    <Grid item xs={12} md={6} lg={6} className={inputFields.institution}>
      <Controller
        control={control}
        name="institution.name"
        render={({ field }) => (
          <Autocomplete
            // value={selectedOption || { value: "" }}
            value={institution}
            autoComplete
            includeInputInList
            disableClearable
            noOptionsText="nein. :("
            forcePopupIcon={false}
            options={options || []}
            inputValue={field.value || ""}
            onInputChange={(e, value) => {
              field.onChange(value);
              institution.id && setValue("institution.id", "");
            }}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => {
              return option.id === value.id && Boolean(value.id);
            }}
            renderOption={(option) =>
              option.id
                ? `${option.name} ??? ${option.id}`
                : `"${option.name}" hinzuf??gen`
            }
            filterOptions={(options) => {
              const filtered = options.filter((option) =>
                option.name
                  .toLowerCase()
                  .includes(field.value?.toLowerCase() || "")
              );
              field.value &&
                field.value !== "" &&
                hasInstitutionWrite(user) &&
                filtered.push({
                  name: field.value,
                });
              return filtered;
            }}
            onChange={(e, option) => {
              if (!option.id) {
                setIsDialogOpen(true);
              } else setValue("institution.id", option.id);
              setValue("institution.name", option.name);
            }}
            disabled={disabled}
            renderInput={(params) =>
              RenderInput({
                name: "institution.name",
                placeholder: "Name der Institution",
                autoComplete: "organization",
                required: "Name der Institution muss angegeben werden",
                icon: faUniversity,
                formState,
                disabled,
                params,
              })
            }
          />
        )}
      />
    </Grid>,

    <Grid item xs={12} md={6} lg={6} className={inputFields.lastName}>
      {RenderInput({
        name: "lastName",
        placeholder: "Nachname",
        autoComplete: "family-name",
        required: "Nachname muss angegeben werden",
        icon: faEdit,
        disabled,
        formState,
      })}
    </Grid>,

    <Grid item xs={12} md={6} lg={6} className={inputFields.email}>
      <EmailInputField formState={formState} disabled={disabled} />
    </Grid>,

    <Grid item xs={12} md={6} lg={6} className={inputFields.mobilePhone}>
      {RenderInput({
        name: "mobilePhone",
        placeholder: "Handynummer",
        type: "tel",
        required: "Handynummer muss angegeben werden",
        icon: faEdit,
        disabled,
        formState,
      })}
    </Grid>,

    <Grid item xs={12} md={6} lg={6} className={inputFields.businessPhone}>
      {RenderInput({
        name: "businessPhone",
        placeholder: "Telefonnummer dienstlich",
        type: "tel",
        required: "Telefonnummer dienstlich muss angegeben werden",
        icon: faEdit,
        disabled,
        formState,
      })}
    </Grid>,
  ];

  return (
    <div className="container">
      {isDialogOpen && (
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          maxWidth="lg"
        >
          <DialogTitle>Institution Erstellen</DialogTitle>
          <DialogContent>
            <div className="container">
              <CreateInstitutionForm
                onSubmit={async (data) => {
                  setValue("institution.name", data.name);
                  setValue("institution.id", data.id);
                  setIsDialogOpen(false);
                  setMessage("Erfolgreich gespeichert.");
                  setSnackbarOpen(true);
                  return await fetchData();
                }}
                defaultInstitution={{ name: institution.name }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Form
        button={
          <Button
            type="submit"
            label="Erstellen"
            buttonStyle={formButton}
            textColor="white"
            backgroundColor={theme.palette.primary.main}
            isLoading={isLoading}
            disabled={disabled || isLoading}
          />
        }
        inputs={inputs}
        maxWidth="200ch"
        onSubmit={handleSubmit((data, event) => {
          setIsLoading(true);
          try {
            onSubmit(data, event);
          } catch (error) {
            setMessage("Fehler beim Speichern.");
            setSnackbarOpen(true);
          } finally {
            setIsLoading(false);
          }
        })}
        order={order}
      />
    </div>
  );
}

export function ViewCustomerDetails() {
  const { id } = useParams();
  const { data, isLoading } = useCustomer(Number(id));
  return isLoading ? (
    <Loading />
  ) : data ? (
    <CustomerDetails data={data} />
  ) : (
    <PageNotFound />
  );
}
