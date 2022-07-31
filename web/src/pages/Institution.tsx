import { BaseSyntheticEvent, useEffect, useState } from "react";
import {
  Control,
  Controller,
  ControllerRenderProps,
  DeepMap,
  DeepPartial,
  FieldError,
  Path,
  PathValue,
  UnpackNestedValue,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
  ValidationRule,
  useForm,
} from "react-hook-form";
import Form, { OrderType } from "../components/Form";
import {
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import {
  IconDefinition,
  faKeyboard,
  faMapMarkerAlt,
  faQuestion,
  faTimes,
  faUniversity,
  faVoicemail,
} from "@fortawesome/free-solid-svg-icons";
import {
  InstitutionOverlay,
  useDetailsStyles,
} from "../components/InstitutionDetails";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Table, { TableHeaders, accessNestedValues } from "../components/Table";
import axios, { AxiosResponse } from "axios";
import {
  faCheckSquare,
  faEdit,
  faEye,
  faEyeSlash,
  faSquare,
} from "@fortawesome/free-regular-svg-icons";
import useInstitutions, {
  InstitutionsSearchParams,
} from "../hooks/useInstitutions";

import { AnimatePresence } from "framer-motion";
import { AutocompleteRenderInputParams } from "@material-ui/lab";
import Button from "../components/Button";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { CustomerType } from "./Customer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormErrorMessage from "../components/FormErrorMessage";
import Loading from "../components/Loading";
import PageNotFound from "./PageNotFound";
import PlacesAutocomplete from "../components/PlacesAutocomplete";
import useEventListener from "@use-it/event-listener";
import useInstitution from "../hooks/useInstitution";
import { useQueryClient } from "react-query";
import { useSnackbar } from "../Wrapper";

type Address = {
  street: string;
  streetNumber: number;
  zipCode: number;
  town: string;
};

type InstitutionType = {
  id: number | string;
  name: string;
  address: Address;
  phoneNumber: number;
  schoolAdministrativeDistrict: boolean;
  customers?: Array<CustomerType>;
};

type FormAddress = {
  street: string;
  streetNumber: string;
  zipCode: string;
  town: string;
};

export type FormInstitutionType = {
  id: string;
  name: string;
  address: FormAddress;
  phoneNumber: string;
  schoolAdministrativeDistrict: boolean;
  customers?: Array<CustomerType>;
};

export type FormState<T> = {
  setValue: UseFormSetValue<T>;
  control: Control<T>;
  errors: DeepMap<DeepPartial<T>, FieldError>;
  clearErrors: UseFormClearErrors<T>;
  watch: UseFormWatch<T>;
  formInput: ClassNameMap<
    | "input"
    | "checkbox"
    | "select"
    | "menuItem"
    | "formControl"
    | "clearButton"
    | "clickable"
    | "toggleViewPassword"
  >;
};

export type Autocomplete =
  | "name"
  | "honorific-prefix"
  | "given-name"
  | "additional-name"
  | "family-name"
  | "honorific-suffix"
  | "nickname"
  | "username"
  | "new-password"
  | "current-password"
  | "one-time-code"
  | "organization-title"
  | "organization"
  | "street-address"
  | "address-line1"
  | "address-line2"
  | "address-line3"
  | "address-level4"
  | "address-level3"
  | "address-level2"
  | "address-level1"
  | "country"
  | "country-name"
  | "postal-code"
  | "cc-name"
  | "cc-given-name"
  | "cc-additional-name"
  | "cc-family-name"
  | "cc-number"
  | "cc-exp"
  | "cc-exp-month"
  | "cc-exp-year"
  | "cc-csc"
  | "cc-type"
  | "transaction-currency"
  | "transaction-amount"
  | "language"
  | "bday"
  | "bday-day"
  | "bday-month"
  | "bday-year"
  | "sex"
  | "url"
  | "photo"
  | "tel"
  | "tel-country-code"
  | "tel-national"
  | "tel-area-code"
  | "tel-local"
  | "tel-local-prefix"
  | "tel-local-suffix"
  | "tel-extension"
  | "email"
  | "impp";

export const useButtonStyles = makeStyles({
  button: {
    maxWidth: "1em",
  },
});

export const useInputStyles = makeStyles({
  input: {
    margin: "0.5em 0",
    minWidth: "100%",
    fontSize: "1em",
    "&>*": {
      fontFamily: "Segoe UI",
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled)::before": {
      borderColor: "var(--border)",
      borderWidth: "1.5px",
    },
    "& .MuiInput-underline:after": {
      transitionDuration: "300ms",
    },
    "&::placeholder": {
      userSelect: "none",
      color: "red",
    },
  },
  checkbox: {
    color: "var(--border)",
  },
  select: {
    marginBottom: 0,
    marginLeft: 0,
  },
  menuItem: {
    fontFamily: "Segoe UI",
  },
  formControl: {
    marginTop: 0,
  },
  clickable: {
    "&:hover": { cursor: "pointer" },
  },
  clearButton: {
    width: "1em",
    height: "1em",
    borderRadius: "50%",
    margin: 0,
    padding: 0,
    "&:hover": {
      cursor: "pointer",
    },
  },
  toggleViewPassword: {
    paddingRight: "0.5em",
  },
  tableContainer: {
    width: "100%",
    height: "80%",
  },
});

export const RenderInput = <T,>({
  name,
  placeholder,
  required,
  pattern,
  type = "text",
  icon = faEdit,
  autocompletePlaces,
  autofocus,
  autoComplete,
  isModifiable = true,
  disabled,
  formState,
  params,
}: {
  name: Path<T>;
  placeholder: string;
  required?: ValidationRule<boolean> | string;
  pattern?: ValidationRule<RegExp>;
  type?: string;
  icon?: IconDefinition;
  autocompletePlaces?: "address" | "school" | "point_of_interest";
  autofocus?: boolean;
  autoComplete?: Autocomplete;
  isModifiable?: boolean;
  disabled?: boolean;
  formState: FormState<T>;
  params?: AutocompleteRenderInputParams;
}) => {
  const { setValue, control, errors, clearErrors, watch, formInput } =
    formState;

  const value = watch(name);

  const error = accessNestedValues(name, errors);
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearErrors(name);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, name, clearErrors]);
  const [showPassword, setShowPassword] = useState(false);

  const InputProps = {
    startAdornment: (
      <InputAdornment position="start">
        <FontAwesomeIcon className="inputIcon" icon={icon} />
      </InputAdornment>
    ),
    endAdornment: (
      <>
        {type === "password" && value && (
          <InputAdornment
            position="end"
            className={`${formInput.clickable} ${formInput.toggleViewPassword}`}
          >
            <FontAwesomeIcon
              className="inputIcon"
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword((value) => !value)}
            />
          </InputAdornment>
        )}
        {value && !disabled && isModifiable && (
          <InputAdornment position="end" className={formInput.clearButton}>
            <FontAwesomeIcon
              className="inputIcon"
              icon={faTimes}
              onClick={() =>
                setValue(name, "" as UnpackNestedValue<PathValue<T, Path<T>>>, {
                  shouldValidate: true,
                })
              }
            />
          </InputAdornment>
        )}
      </>
    ),
  };

  return (
    <label>
      <AnimatePresence>
        {accessNestedValues(name, errors) && (
          <FormErrorMessage
            message={accessNestedValues(name, errors).message}
            name={name}
          />
        )}
      </AnimatePresence>
      <Controller
        control={control}
        name={name}
        rules={{ required, pattern }}
        render={({ field }) =>
          autocompletePlaces ? (
            <PlacesAutocomplete
              setValueInForm={
                setValue as unknown as UseFormSetValue<FormInstitutionType>
              }
              params={
                field as ControllerRenderProps<
                  FormInstitutionType,
                  "name" | "address.street"
                >
              }
              searchFor={autocompletePlaces}
              InputProps={InputProps}
              autoComplete={autoComplete}
              disabled={disabled || !isModifiable}
            >
              <TextField
                placeholder={placeholder}
                type="text"
                className={formInput.input}
                autoFocus={autofocus}
              />
            </PlacesAutocomplete>
          ) : (
            <TextField
              placeholder={placeholder}
              type={type === "password" && showPassword ? "text" : type}
              className={formInput.input}
              {...field}
              value={field.value || ""}
              {...params}
              InputProps={{ ...params?.InputProps, ...InputProps }}
              autoFocus={autofocus}
              autoComplete={autoComplete}
              disabled={disabled || !isModifiable}
            />
          )
        }
      />
    </label>
  );
};

export default function Institution() {
  return <Outlet />;
}

export type RecursivePartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer L> ? T[K] : RecursivePartial<T[K]>; // eslint-disable-line
};

export function CreateInstitution({
  defaultInstitution,
}: {
  defaultInstitution?: RecursivePartial<FormInstitutionType>;
}) {
  return (
    <div className="container">
      <CreateInstitutionForm defaultInstitution={defaultInstitution} />
    </div>
  );
}

const format = (value: boolean) => (
  <FontAwesomeIcon
    style={{ marginRight: "2em", fontSize: "1em" }}
    icon={value ? faCheckSquare : faSquare}
  />
);

const tableHeaders: TableHeaders<InstitutionType> = {
  id: { label: "INST-Code", width: 1 },
  name: { label: "Name", width: 2 },
  address: {
    street: { label: "Straße", width: 2 },
    streetNumber: { label: "Hausnummer", width: 1 },
    town: { label: "Ort", width: 1 },
    zipCode: { label: "PLZ", width: 1 },
  },
  phoneNumber: { label: "Telefonnummer", width: 2 },
  schoolAdministrativeDistrict: {
    label: "SVB?",
    format,
    align: "right",
    width: 0.5,
  },
};

export function CreateInstitutionForm({
  defaultInstitution,
  onSubmit,
}: {
  defaultInstitution?: RecursivePartial<FormInstitutionType>;
  onSubmit?: (
    data: FormInstitutionType,
    event?: BaseSyntheticEvent
  ) => Promise<AxiosResponse<FormInstitutionType | Array<FormInstitutionType>>>;
}) {
  const navigate = useNavigate();
  const { setMessage, setSnackbarOpen } = useSnackbar();

  const submit: (
    data: FormInstitutionType,
    event?: BaseSyntheticEvent
  ) => Promise<
    AxiosResponse<FormInstitutionType | Array<FormInstitutionType>>
  > =
    onSubmit ||
    (async (data, event) => {
      try {
        const response = await axios.post<FormInstitutionType>(
          "http://localhost:8080/institution",
          data
        );
        if (response.status === 200) {
          setMessage("Erfolgreich gespeichert.");
          setSnackbarOpen(true);
          navigate("/institutions");
        }
        return response;
      } catch (error) {
        throw error;
      }
    });

  return (
    <InstitutionForm onSubmit={submit} defaultValues={defaultInstitution} />
  );
}

export function UpdateInstitutionForm({
  data,
}: {
  data?: FormInstitutionType;
}) {
  const queryClient = useQueryClient();
  const institutionStyles = useDetailsStyles();
  const navigate = useNavigate();
  const { setMessage, setSnackbarOpen } = useSnackbar();

  const updateData = async (data?: FormInstitutionType) => {
    try {
      const response = await axios.put<FormInstitutionType>(
        "http://localhost:8080/institution",
        data
      );
      if (response.status === 200) {
        queryClient.invalidateQueries("institutions");
        queryClient.invalidateQueries("institution");
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
    getValues: UseFormGetValues<FormInstitutionType>
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
          className={institutionStyles.toggleLabel}
        />
      </Grid>
    );
    return editableToggle;
  };

  return (
    <InstitutionForm
      onSubmit={async (data) => {
        try {
          const response = await updateData(data);
          navigate("/institutions");
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

export function InstitutionForm({
  defaultValues,
  onSubmit,
  toggleLabel,
  defaultDisabled = false,
}: {
  defaultValues?: RecursivePartial<FormInstitutionType>;
  onSubmit: (
    data: FormInstitutionType,
    event?: BaseSyntheticEvent
  ) => Promise<AxiosResponse<FormInstitutionType | Array<FormInstitutionType>>>;
  toggleLabel?: (
    disabled: boolean,
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
    getValues: UseFormGetValues<FormInstitutionType>
  ) => JSX.Element;
  defaultDisabled?: boolean;
}) {
  const defaultInstitution = {
    id: defaultValues?.id || "",
    name: defaultValues?.name || "",
    phoneNumber: defaultValues?.phoneNumber || "",
    schoolAdministrativeDistrict:
      defaultValues?.schoolAdministrativeDistrict || false,
    address: {
      street: defaultValues?.address?.street || "",
      streetNumber: defaultValues?.address?.streetNumber || "",
      town: defaultValues?.address?.town || "",
      zipCode: defaultValues?.address?.zipCode || "",
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
  } = useForm<FormInstitutionType>({
    mode: "onChange",
    defaultValues: defaultInstitution,
  });

  const theme = useTheme();
  const formInput = useInputStyles();
  const formButton = useButtonStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(defaultDisabled);
  const { setMessage, setSnackbarOpen } = useSnackbar();

  const zipCode = watch("address.zipCode");
  const formState: FormState<FormInstitutionType> = {
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

  useEffect(() => {
    setValue("schoolAdministrativeDistrict", Boolean(zipCode));
    // zipCode is changing over runtime, though, eslint does not see it because watch returns a string
    // eslint-disable-next-line
  }, [zipCode]);

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
        name: "name",
        placeholder: "Name",
        autocompletePlaces: "school",
        required: "Institutions-Name muss angegeben werden",
        autofocus: true,
        icon: faUniversity,
        autoComplete: "organization",
        disabled,
        formState,
      })}
    </Grid>,
    <Grid item xs={12} md={6} lg={6}>
      {RenderInput({
        name: "id",
        placeholder: "INST-Code",
        required: "INST-Code muss angegeben werden",
        icon: faKeyboard,
        isModifiable: !defaultDisabled,
        disabled,
        formState,
      })}
    </Grid>,
    <Grid item xs={12} md={6} lg={6}>
      {RenderInput({
        name: "phoneNumber",
        placeholder: "Telefonnummer",
        required: "Telefonnummer muss angegeben werden",
        icon: faVoicemail,
        autoComplete: "tel",
        pattern: {
          value: /^[0-9]+([-\s][0-9]+)*$/,
          message: "Telefonnummer ist ungültig",
        },
        disabled,
        formState,
      })}
    </Grid>,
    <Grid item xs={12} md={6} lg={4}>
      {RenderInput({
        name: "address.street",
        placeholder: "Straße",
        autocompletePlaces: "address",
        required: "Straße muss angegeben werden",
        icon: faMapMarkerAlt,
        autoComplete: "address-line1",
        disabled,
        formState,
      })}
    </Grid>,
    <Grid item xs={12} md={6} lg={2}>
      {RenderInput({
        name: "address.streetNumber",
        placeholder: "Hausnummer",
        required: "Hausnummer muss angegeben werden",
        icon: faMapMarkerAlt,
        autoComplete: "address-line2",
        pattern: {
          value:
            /^[0-9]+[a-zA-ZäöüÄÖÜß]*((-[0-9]+[a-zA-ZäöüÄÖÜß]*)|(-[a-zA-ZäöüÄÖÜß]))?$/,
          message: "Hausnummer ist ungültig",
        },
        disabled,
        formState,
      })}
    </Grid>,
    <Grid item xs={12} md={6} lg={4}>
      {RenderInput({
        name: "address.town",
        placeholder: "Stadt",
        required: "Stadt muss angegeben werden",
        icon: faMapMarkerAlt,
        autoComplete: "address-level2",
        disabled,
        formState,
      })}
    </Grid>,
    <Grid item xs={12} md={6} lg={2}>
      {RenderInput({
        name: "address.zipCode",
        placeholder: "Postleitzahl",
        required: "Postleitzahl muss angegeben werden",
        icon: faMapMarkerAlt,
        autoComplete: "postal-code",
        pattern: {
          value: /^[0-9]{5}$/,
          message: "Postleitzahl ist ungültig",
        },
        disabled,
        formState,
      })}
    </Grid>,
    <Grid item xs={12} md={6} lg={6}>
      <Controller
        control={control}
        name="schoolAdministrativeDistrict"
        render={({ field }) => (
          <FormControl
            className={`${formInput.input} ${formInput.formControl}`}
            disabled={disabled}
          >
            <InputLabel id="schoolAdministrativeDistrict">
              Schulverwaltungsbezirk?
            </InputLabel>
            <Select
              className={`${formInput.select} ${formInput.input}`}
              {...field}
              value={field.value ? 1 : 0}
              startAdornment={
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faQuestion} className="inputIcon" />
                </InputAdornment>
              }
              labelId="schoolAdministrativeDistrict"
            >
              <MenuItem value={1} className={formInput.menuItem}>
                Ja
              </MenuItem>
              <MenuItem value={0} className={formInput.menuItem}>
                Nein
              </MenuItem>
            </Select>
          </FormControl>
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
          if (axios.isAxiosError(error)) {
            setMessage(error.response?.data.message);
          }
          setSnackbarOpen(true);
        } finally {
          setIsLoading(false);
        }
      })}
      order={order}
    />
  );
}

export function Institutions() {
  const { data, isLoading, setSearchParams } = useInstitutions();
  const navigate = useNavigate();

  const onKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "n" && event.altKey) {
      event.preventDefault();
      navigate("./create");
    }
  };

  useEventListener("keydown", onKeyDown);

  async function search(
    parameter?: keyof InstitutionsSearchParams,
    query?: string
  ) {
    setSearchParams(
      (value) =>
        parameter &&
        (value ? { ...value, [parameter]: query } : { [parameter]: query })
    );
  }

  const searchParams: Array<{
    [key in keyof InstitutionsSearchParams]: "string" | "number";
  }> = [
    { id: "string" },
    { name: "string" },
    { "address.street": "string" },
    { schoolAdministrativeDistrict: "number" },
  ];

  return (
    <div className="container">
      <Table
        tableHeaders={tableHeaders}
        rows={data || []}
        sort={["Name", "INST-Code", "Straße", "Ort", "PLZ", "Telefonnummer"]}
        onRowClick={(row) => navigate(`./${row.id}`)}
        search={search}
        searchParams={searchParams}
        isLoading={isLoading}
      />
    </div>
  );
}

export function ViewInstitutionDetails() {
  const { instCode } = useParams();
  const { data, isLoading } = useInstitution(instCode || "");
  if (!instCode) {
    return <PageNotFound />;
  }
  return isLoading ? (
    <Loading />
  ) : data ? (
    <InstitutionOverlay instCode={instCode} data={data} />
  ) : (
    <PageNotFound />
  );
}
