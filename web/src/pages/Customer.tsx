import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { Controller, UseFormGetValues, useForm } from "react-hook-form";
import {
  CreateInstitution,
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
  InputAdornment,
  Snackbar,
  Switch,
  TextField,
  Theme,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import Form, { EmailInputField, OrderType } from "../components/Form";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Table, { TableHeaders } from "../components/Table";
import useCustomers, { CustomerSearchParams } from "../hooks/useCustomers";

import { AnimatePresence } from "framer-motion";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormErrorMessage from "../components/FormErrorMessage";
import Loading from "../components/Loading";
import axios from "axios";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faUniversity } from "@fortawesome/free-solid-svg-icons";
import useCustomer from "../hooks/useCustomer";
import { useDetailsStyles } from "../components/InstitutionDetails";
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
  const search = (searchParam: keyof CustomerSearchParams, query: string) => {
    setSearchParams({ [searchParam]: query });
  };

  return (
    <Table
      tableHeaders={tableHeaders}
      rows={data?.data || []}
      sort={["Vorname", "Nachname", "Email"]}
      onRowClick={(row) => navigate(`/customers/${row.id}`)}
      isLoading={isLoading}
      search={search}
      searchParams={["firstName", "lastName"]}
    />
  );
}

export function CreateCustomer() {
  return <CreateCustomerForm />;
}

export function CustomerDetails({ data }: { data?: CustomerType }) {
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
  onSubmit?: (data: CustomerType, event?: BaseSyntheticEvent) => void;
}) {
  const navigate = useNavigate();
  const { setMessage, setSnackbarOpen } = useSnackbar();

  const submit: (data: CustomerType, event?: BaseSyntheticEvent) => void =
    onSubmit ||
    (async (data, event) => {
      const response = await axios.post<CustomerType>(
        "http://localhost:8080/customer",
        data
      );
      setMessage("Erfolgreich gespeichert.");
      setSnackbarOpen(true);
      navigate("/customers");
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
      queryClient.invalidateQueries("customer");
      queryClient.invalidateQueries("customers");
    } catch (error) {
      console.log(error);
    }
  };
  const toggleLabel = (
    disabled: boolean,
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
    getValues: UseFormGetValues<CustomerType>
  ) => {
    const editableToggle = (
      <Grid item container xs={12} justify="flex-end">
        <FormControlLabel
          control={
            <Switch
              checked={!disabled}
              onChange={() => {
                if (!disabled) {
                  updateData(getValues());
                  setMessage("Erfolgreich aktualisiert.");
                  setSnackbarOpen(true);
                }
                setDisabled((value) => !value);
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
      onSubmit={(data) => {
        navigate("/customers");
        updateData(data);
        setMessage("Erfolgreich aktualisiert.");
        setSnackbarOpen(true);
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
  onSubmit: (data: CustomerType, event?: BaseSyntheticEvent) => void;
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(defaultDisabled);
  const [options, setOptions] =
    useState<Array<{ name: string; id?: string }>>();
  const [selectedOption, setSelectedOption] = useState<{
    name: string;
    id?: string;
  }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setSnackbarOpen, setMessage } = useSnackbar();

  const institution = watch("institution");
  const formState: FormState<CustomerType> = {
    clearErrors,
    control,
    errors,
    formInput,
    getValues,
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
        try {
          await axios.post<CustomerType>(
            "http://localhost:8080/customer",
            getValues()
          );
          navigate("/customers");
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

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
                ? `${option.name} — ${option.id}`
                : `"${option.name}" hinzufügen`
            }
            filterOptions={(options) => {
              const filtered = options.filter((option) =>
                option.name
                  .toLowerCase()
                  .includes(field.value?.toLowerCase() || "")
              );
              field.value &&
                field.value !== "" &&
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
              setSelectedOption(option);
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
            console.error(error);
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
  const { data, isLoading } = useCustomer(id);
  // GET and stuff
  // useEffect(() => {
  //   console.log(data);
  // }, [data]);
  return isLoading ? <Loading /> : <CustomerDetails data={data?.data} />;
}
