import "../styles/Table.css";

import {
  InputAdornment,
  TextField,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import Table, { TableHeaders } from "../components/Table";
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
import { useForm } from "react-hook-form";

type Address = {
  street: string;
  streetNumber: number;
  zipCode: number;
  town: string;
};

type InstitutionType = {
  id: string;
  name: string;
  address: Address;
  phoneNumber: number;
  schoolAdministrativeDistrict: boolean;
};

const useButtonStyles = makeStyles({
  button: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2em",
    padding: "0.5em 10%",
  },
});

const useInputStyles = makeStyles({
  input: {
    margin: "0.5em",
    width: "30vw",
    minWidth: "200px",
    maxWidth: "350px",
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
});

export default function Institution() {
  return <Outlet />;
}

export function CreateInstitution() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InstitutionType>({ mode: "onChange" });
  const formInput = useInputStyles();
  const formButton = useButtonStyles();
  const theme = useTheme();

  return (
    <div className="container">
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
      >
        <label>
          {errors.id && <FormErrorMessage message={errors.id.message} />}
          <TextField
            placeholder="INST-Code"
            type="text"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon className="inputIcon" icon={faKeyboard} />
                </InputAdornment>
              ),
              ...register("id", {
                required:
                  "INST-Code muss angegeben werden und eindeutig sein oder so",
              }),
            }}
            autoFocus
          />
        </label>
        <label>
          {errors.name && <FormErrorMessage message={errors.name.message} />}
          <FontAwesomeIcon className="inputIcon" icon={faEdit} />
          <TextField
            placeholder="Name"
            type="text"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon className="inputIcon" icon={faKeyboard} />
                </InputAdornment>
              ),
              ...register("name", {
                required: "Name der Institution muss angegeben werden",
              }),
            }}
          />
        </label>
        <label>
          {errors.phoneNumber && (
            <FormErrorMessage message={errors.phoneNumber.message} />
          )}
          <TextField
            placeholder="Telefonnummer"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon className="inputIcon" icon={faEdit} />
                </InputAdornment>
              ),
              ...register("phoneNumber", {
                required: "Telefonnummer muss angegeben werden",
                pattern: {
                  value: /^[0-9\s-/]+$/,
                  message: "Telefonnummer nur aus Zahlen",
                },
              }),
            }}
            type="tel"
          />
        </label>
        <label>
          {errors.address?.street && (
            <FormErrorMessage message={errors.address.street.message} />
          )}
          <TextField
            placeholder="Straße"
            type="text"
            className={formInput.input}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon className="inputIcon" icon={faEdit} />
                </InputAdornment>
              ),
              ...register("address.street", {
                required: "Straße muss angegeben werden",
              }),
            }}
          />
        </label>
        <div className="halfstuff">
          <label className="half">
            {errors.address?.zipCode && (
              <FormErrorMessage message={errors.address.zipCode.message} />
            )}
            <TextField
              placeholder="Postleitzahl"
              type="tel"
              className={formInput.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon className="inputIcon" icon={faEdit} />
                  </InputAdornment>
                ),
                ...register("address.zipCode", {
                  required: "Postleitzahl muss angegeben werden",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Was denn bei deiner Postleitzahl los?!",
                  },
                }),
              }}
            />
          </label>
          <label className="half">
            {errors.address?.town && (
              <FormErrorMessage message={errors.address.town.message} />
            )}
            <TextField
              placeholder="Stadt"
              type="text"
              className={formInput.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon className="inputIcon" icon={faEdit} />
                  </InputAdornment>
                ),
                ...register("address.town", {
                  required: "Ort muss angegeben werden",
                }),
              }}
            />
          </label>
        </div>
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

const institutions: Array<InstitutionType> = [
  {
    id: String(1),
    name: "name",
    address: { street: "asdf", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: String(2),
    name: "name",
    address: { street: "bsdf", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: String(3),
    name: "name",
    address: { street: "csdf", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: String(4),
    name: "name",
    address: { street: "gsdf", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: String(5),
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
    id: String(6),
    name: "name",
    address: { street: "asldf", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: String(7),
    name: "name",
    address: { street: "blub", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: String(8),
    name: "name",
    address: { street: "blub", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: String(9),
    name: "name",
    address: { street: "blub", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: String(10),
    name: "name",
    address: { street: "blub", streetNumber: 42, town: "bla", zipCode: 31415 },
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    id: String(11),
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
    label: "Schulverwaltungsbezirk?",
    format,
    align: "right",
  },
};

export function Institutions() {
  return (
    <div className="container">
      <Table
        tableHeaders={tableHeaders}
        rows={institutions}
        sort={[
          "Name",
          "INST-Code",
          "Straße",
          "Ort",
          "PLZ",
          "Telefonnummer",
          "Schulverwaltungsbezirk?",
        ]}
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
