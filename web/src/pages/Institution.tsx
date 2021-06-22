import "../styles/Table.css";

import {
  Controller,
  ControllerRenderProps,
  ValidationRule,
  useForm,
} from "react-hook-form";
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
  faMapMarkerAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Table, {
  Leaves,
  TableHeaders,
  accessNestedValues,
} from "../components/Table";
import {
  faCheckSquare,
  faEdit,
  faKeyboard,
  faSquare,
} from "@fortawesome/free-regular-svg-icons";

import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormErrorMessage from "../components/FormErrorMessage";
import { Outlet } from "react-router-dom";
import PlacesAutocomplete from "../components/PlacesAutocomplete";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

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
};

const useButtonStyles = makeStyles({
  button: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2em",
    padding: "0.5em max(10%, 3em)",
    maxWidth: "1em",
  },
});

const useInputStyles = makeStyles({
  input: {
    margin: "0.5em",
    minWidth: "100%",
    fontSize: "1em",
    fontFamily: "inherit",
    "& .MuiInput-underline:hover:not(.Mui-disabled)::before": {
      borderColor: "var(--border)",
      borderWidth: "1.5px",
    },
    "& .MuiInput-underline:after": {
      transitionDuration: "300ms",
    },
  },
  checkbox: {
    color: "var(--border)",
  },
  clearButton: {
    width: "1em",
    height: "1em",
    borderRadius: "50%",
    margin: 0,
    padding: 0,
    "&:hover": {
      color: "red",
      boxShadow: "0 0 0 2pt red",
    },
  },
});

export default function Institution() {
  return <Outlet />;
}

export function CreateInstitution() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormInstitutionType>({
    mode: "onChange",
    defaultValues: {
      id: "",
      name: "",
      phoneNumber: "",
      schoolAdministrativeDistrict: false,
      address: { street: "", streetNumber: "", town: "", zipCode: "" },
    },
  });
  const formInput = useInputStyles();
  const formButton = useButtonStyles();
  const theme = useTheme();
  const zipCode = watch("address.zipCode");

  const RenderInput = ({
    name,
    placeholder,
    required,
    type = "text",
    icon = faEdit,
    autocompletePlaces,
    autofocus,
  }: {
    name: Leaves<FormInstitutionType>;
    placeholder: string;
    required?: ValidationRule<boolean> | string;
    type?: string;
    icon?: IconDefinition;
    autocompletePlaces?: "address" | "school";
    autofocus?: boolean;
  }) => {
    useEffect(() => {
      setValue("schoolAdministrativeDistrict", Boolean(zipCode), {
        shouldValidate: true,
      });
    }, [zipCode]);
    const InputProps = {
      startAdornment: (
        <InputAdornment position="start">
          <FontAwesomeIcon className="inputIcon" icon={icon} />
        </InputAdornment>
      ),
      endAdornment: getValues(name) && (
        <InputAdornment position="end" className={formInput.clearButton}>
          <FontAwesomeIcon
            className={`inputIcon`}
            icon={faTimes}
            onClick={() => setValue(name, "", { shouldValidate: true })}
          />
        </InputAdornment>
      ),
    };

    return (
      <label>
        {accessNestedValues(name, errors) && (
          <FormErrorMessage
            message={accessNestedValues(name, errors).message}
          />
        )}
        <Controller
          control={control}
          name={name}
          rules={required ? { required } : undefined}
          render={({ field }) =>
            autocompletePlaces ? (
              <PlacesAutocomplete
                setValueInForm={setValue}
                params={
                  field as ControllerRenderProps<
                    FormInstitutionType,
                    "name" | "address.street"
                  >
                }
                searchFor={autocompletePlaces}
                InputProps={InputProps}
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
                InputProps={InputProps}
                autoFocus={autofocus}
              />
            )
          }
        />
      </label>
    );
  };

  return (
    <div className="container">
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data, "bin hier");
        })}
        style={{ width: "80%" }}
      >
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12} md={6} lg={6}>
            {RenderInput({
              name: "name",
              placeholder: "Name",
              autocompletePlaces: "school",
              required: "Institutions-Name muss angegeben werden",
              autofocus: true,
            })}
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            {RenderInput({
              name: "id",
              placeholder: "INST-Code",
              required: "INST-Code muss angegeben werden",
            })}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {RenderInput({
              name: "address.street",
              placeholder: "Straße",
              autocompletePlaces: "address",
              required: "Straße muss angegeben werden",
            })}
          </Grid>

          <Grid item xs={12} md={6} lg={2}>
            {RenderInput({
              name: "address.streetNumber",
              placeholder: "Hausnummer",
              required: "Hausnummer muss angegeben werden",
            })}
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            {RenderInput({
              name: "phoneNumber",
              placeholder: "Telefonnummer",
              required: "Telefonnummer muss angegeben werden",
            })}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {RenderInput({
              name: "address.town",
              placeholder: "Stadt",
              required: "Stadt muss angegeben werden",
            })}
          </Grid>

          <Grid item xs={12} md={6} lg={2}>
            {RenderInput({
              name: "address.zipCode",
              placeholder: "Postleitzahl",
              required: "",
            })}
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Controller
              control={control}
              name="schoolAdministrativeDistrict"
              render={({ field }) => (
                <FormControl className={formInput.input}>
                  <InputLabel id="schoolAdministrativeDistrict">
                    Schulverwaltungsbezirk?
                  </InputLabel>
                  <Select
                    {...field}
                    value={field.value ? 1 : 0}
                    className={formInput.input}
                    startAdornment={
                      <InputAdornment position="start">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="inputIcon"
                        />
                      </InputAdornment>
                    }
                    labelId="schoolAdministrativeDistrict"
                  >
                    <MenuItem value={1}>Ja</MenuItem>
                    <MenuItem value={0}>neeeeeeein</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          label="Weiter"
          buttonStyle={formButton}
          textColor="white"
          backgroundColor={theme.palette.primary.main}
        />
      </form>
    </div>
  );
}

const dummyInstitutions: Array<InstitutionType> = [
  {
    id: 1,
    name: "name",
    address: { street: "asdf", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: 2,
    name: "name",
    address: { street: "bsdf", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: 3,
    name: "name",
    address: { street: "csdf", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: 4,
    name: "name",
    address: { street: "gsdf", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: 5,
    name: "name",
    address: {
      street: "efsadf",
      streetNumber: 42,
      town: "bla",
      zipCode: 31415,
    },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: "LLGGI",
    name: "Landgraf Ludwigs Gymnasium Gießen wir brauchen mehr text hier jetzt das reicht noch nicht immer noch zu wenig die tabelle ist zu klein uff jetzt werd doch groß genug dass wir sehen was passiert pls oh sie reduziert automatisch padding und macht line breaks",
    address: {
      street: "Reichenberger Straße",
      streetNumber: 11,
      town: "Gießen",
      zipCode: 35396,
    },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: 7,
    name: "name",
    address: { street: "blub", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: 8,
    name: "name",
    address: { street: "blub", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: 9,
    name: "name",
    address: { street: "blub", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: 10,
    name: "name",
    address: { street: "blub", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: 11,
    name: "name",
    address: { street: "blub", streetNumber: 42, town: "bla", zipCode: 2 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
];

const format = (value: boolean) => (
  <FontAwesomeIcon
    style={{ marginRight: "2em", fontSize: "1em" }}
    icon={value ? faCheckSquare : faSquare}
  />
);

const tableHeaders: TableHeaders<InstitutionType> = {
  id: { label: "INST-Code" },
  name: { label: "Name" },
  address: {
    street: { label: "Straße" },
    streetNumber: { label: "Hausnummer" },
    town: { label: "Ort" },
    zipCode: { label: "PLZ" },
  },
  phoneNumber: { label: "Telefonnummer" },
  schoolAdministrativeDistrict: {
    label: "SVB?",
    format,
    align: "right",
  },
};

export function Institutions() {
  const [institutions, setInstitutions] = useState<Array<InstitutionType>>([]);

  useEffect(() => {
    async function foo() {
      // const response = await axios.get<Array<InstitutionType>>(
      //   "http://localhost:8080/institution"
      // );
      // setInstitutions(response.data);
      setInstitutions(dummyInstitutions);
    }
    foo();
  }, []);

  async function search(query: string) {
    const response = await axios.get<Array<InstitutionType>>(
      "http://localhost:8080/institution",
      {
        params: { id: query },
      }
    );
    setInstitutions(response.data);
  }

  return (
    <div className="container">
      <Table
        tableHeaders={tableHeaders}
        rows={institutions}
        sort={["Name", "INST-Code", "Straße", "Ort", "PLZ", "Telefonnummer"]}
        // search={search}
      />
    </div>
  );
}

export function ViewDetails() {
  // let { instCode } = useParams();
  // GET and stuff
  return (
    <div>
      <InstitutionOverlay />
    </div>
  );
}

export function InstitutionOverlay() {
  return <div>asdf</div>;
}
