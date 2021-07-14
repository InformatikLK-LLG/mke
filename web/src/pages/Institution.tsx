import {
  BaseSyntheticEvent,
  FormEventHandler,
  Fragment,
  useEffect,
  useState,
} from "react";
import {
  Control,
  Controller,
  ControllerRenderProps,
  DeepMap,
  FieldError,
  Path,
  PathValue,
  UnpackNestedValue,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormSetValue,
  ValidationRule,
  useForm,
} from "react-hook-form";
import Form, { OrderType } from "../components/Form";
import {
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
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
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Table, { TableHeaders, accessNestedValues } from "../components/Table";
import {
  faCheckSquare,
  faEdit,
  faSquare,
} from "@fortawesome/free-regular-svg-icons";
import useInstitutions, {
  InstitutionsSearchParams,
} from "../hooks/useInstitutions";

import { AnimatePresence } from "framer-motion";
import { AutocompleteRenderInputParams } from "@material-ui/lab";
import Button from "../components/Button";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormErrorMessage from "../components/FormErrorMessage";
import { InstitutionOverlay } from "../components/InstitutionOverlay";
import Loading from "../components/Loading";
import PlacesAutocomplete from "../components/PlacesAutocomplete";
import { Theme } from "@material-ui/core/styles";
import axios from "axios";
import useEventListener from "@use-it/event-listener";
import useInstitution from "../hooks/useInstitution";
import { useQueryClient } from "react-query";
import useViewport from "../hooks/useViewport";

type Address = {
  street: string;
  streetNumber: number;
  zipCode: number;
  town: string;
};

export type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  businessPhone: string;
};

type InstitutionType = {
  id: number | string;
  name: string;
  address: Address;
  phoneNumber: number;
  schoolAdministrativeDistrict: boolean;
  customers?: Array<Customer>;
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
  customers?: Array<Customer>;
};

export type FormState<T> = {
  setValue: UseFormSetValue<T>;
  control: Control<T>;
  errors: DeepMap<T, FieldError>;
  clearErrors: UseFormClearErrors<T>;
  getValues: UseFormGetValues<T>;
  formInput: ClassNameMap<
    "input" | "checkbox" | "select" | "menuItem" | "formControl" | "clearButton"
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
    padding: "0.5em max(10%, 3em)",
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
  disabled?: boolean;
  formState: FormState<T>;
  params?: AutocompleteRenderInputParams;
}) => {
  const { setValue, control, errors, clearErrors, getValues, formInput } =
    formState;

  const error = accessNestedValues(name, errors);
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearErrors(name);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, name, clearErrors]);

  const InputProps = {
    startAdornment: (
      <InputAdornment position="start">
        <FontAwesomeIcon className="inputIcon" icon={icon} />
      </InputAdornment>
    ),
    endAdornment: getValues(name) && !disabled && (
      <InputAdornment position="end" className={formInput.clearButton}>
        <FontAwesomeIcon
          className={`inputIcon`}
          icon={faTimes}
          onClick={() =>
            setValue(name, "" as UnpackNestedValue<PathValue<T, Path<T>>>, {
              shouldValidate: true,
            })
          }
        />
      </InputAdornment>
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
              disabled={disabled}
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
              type={type}
              className={formInput.input}
              {...field}
              value={field.value || ""}
              {...params}
              InputProps={{ ...params?.InputProps, ...InputProps }}
              autoFocus={autofocus}
              autoComplete={autoComplete}
              disabled={disabled}
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

type RecursivePartial<T> = {
  [K in keyof T]?: RecursivePartial<T[K]>;
};

export function CreateInstitution({
  disabled = false,
  onSubmit,
  defaultInstitution,
}: {
  disabled?: boolean;
  onSubmit?: (data: FormInstitutionType, event: BaseSyntheticEvent) => void;
  defaultInstitution?: RecursivePartial<FormInstitutionType>;
}) {
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
    defaultValues: {
      id: defaultInstitution?.id || "",
      name: defaultInstitution?.name || "",
      phoneNumber: defaultInstitution?.phoneNumber || "",
      schoolAdministrativeDistrict:
        defaultInstitution?.schoolAdministrativeDistrict || false,
      address: {
        street: defaultInstitution?.address?.street || "",
        streetNumber: defaultInstitution?.address?.streetNumber || "",
        town: defaultInstitution?.address?.town || "",
        zipCode: defaultInstitution?.address?.zipCode || "",
      },
    },
  });
  const theme = useTheme();
  const formInput = useInputStyles();
  const formButton = useButtonStyles();
  const [isLoading, setIsLoading] = useState(false);
  const width = useViewport();

  const zipCode = watch("address.zipCode");
  const formState: FormState<FormInstitutionType> = {
    clearErrors,
    control,
    errors,
    formInput,
    getValues,
    setValue,
  };

  const navigate = useNavigate();

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
        try {
          await axios.post<FormInstitutionType>(
            "http://localhost:8080/institution",
            getValues()
          );
          navigate("/institutions");
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const inputs = [
    <Grid item xs={12} md={6} lg={6}>
      {RenderInput({
        name: "name",
        placeholder: "Name",
        autocompletePlaces: "school",
        required: "Institutions-Name muss angegeben werden",
        autofocus: true,
        icon: faUniversity,
        autoComplete: "organization",
        formState,
      })}
    </Grid>,
    <Grid item xs={12} md={6} lg={6}>
      {RenderInput({
        name: "id",
        placeholder: "INST-Code",
        required: "INST-Code muss angegeben werden",
        icon: faKeyboard,
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

  const order: OrderType = {
    xs: [1, 2, 3, 4, 5, 6, 7, 8],
    md: [1, 2, 4, 5, 7, 6, 3, 8],
    lg: [1, 2, 4, 5, 3, 6, 7, 8],
  };

  useEventListener("keydown", onKeyDown);

  return (
    <div className="container">
      <Form
        button={
          <Button
            type="submit"
            label="Erstellen"
            buttonStyle={formButton}
            textColor="white"
            backgroundColor={theme.palette.primary.main}
            isLoading={isLoading}
          />
        }
        inputs={inputs}
        onSubmit={handleSubmit(async (data, event) => {
          try {
            setIsLoading(true);
            const response = await axios.post<FormInstitutionType>(
              "http://localhost:8080/institution",
              data
            );
            onSubmit && event
              ? onSubmit(data, event)
              : navigate("/institutions");
          } catch (error) {
            console.log(error);
          } finally {
            setIsLoading(false);
          }
        })}
        order={order}
      />
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

export function Institutions() {
  const [institutions, setInstitutions] = useState<Array<InstitutionType>>([]);
  const { data, isLoading, setSearchParams } = useInstitutions();
  const navigate = useNavigate();
  const formInput = useInputStyles();
  const queryClient = useQueryClient();

  const onKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "n" && event.altKey) {
      event.preventDefault();
      navigate("./create");
    }
  };

  useEventListener("keydown", onKeyDown);

  async function search(
    parameter: keyof InstitutionsSearchParams,
    query: string
  ) {
    setSearchParams({ [parameter]: query });
  }

  return (
    <div className="container">
      {/* <div className={formInput.tableContainer}> */}
      <Table
        tableHeaders={tableHeaders}
        rows={data?.data || []}
        sort={["Name", "INST-Code", "Straße", "Ort", "PLZ", "Telefonnummer"]}
        onRowClick={(row) => navigate(`./${row.id}`)}
        search={search}
        searchParams={["name"]}
        isLoading={isLoading}
      />
      {/* </div> */}
    </div>
  );
}

export function ViewDetails() {
  const { instCode } = useParams();
  const { data, isLoading } = useInstitution(instCode);
  // GET and stuff
  // useEffect(() => {
  //   console.log(data);
  // }, [data]);
  return isLoading ? (
    <Loading />
  ) : (
    <InstitutionOverlay instCode={instCode} data={data} />
  );
}
