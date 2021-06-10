import "../styles/Table.css";

import {
  InputAdornment,
  TextField,
  makeStyles,
  useTheme,
} from "@material-ui/core";

import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormErrorMessage from "../components/FormErrorMessage";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { useForm } from "react-hook-form";

type Address = {
  street: string;
  streetNumber: number;
  zipCode: number;
  town: string;
};

type InstitutionType = {
  firstName: string;
  lastName: string;
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

export default function CreateInstitution() {
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
          {errors.firstName && (
            <FormErrorMessage message={errors.firstName.message} />
          )}
          <TextField
            placeholder="Vorname"
            type="text"
            className={formInput.input}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon className="inputIcon" icon={faEdit} />
                </InputAdornment>
              ),
              ...register("firstName", {
                required: "Vorname muss angegeben werden",
              }),
            }}
            autoFocus
          />
        </label>
        <label>
          {errors.lastName && (
            <FormErrorMessage message={errors.lastName.message} />
          )}
          <TextField
            placeholder="Nachname"
            type="text"
            className={formInput.input}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon className="inputIcon" icon={faEdit} />
                </InputAdornment>
              ),
              ...register("lastName", {
                required: "Nachname muss angegeben werden",
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
    address: { street: "blub", streetNumber: 42, town: "bla", zipCode: 31415 },
    firstName: "name",
    lastName: "last name",
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    address: { street: "blub", streetNumber: 42, town: "bla", zipCode: 31415 },
    firstName: "name",
    lastName: "last name",
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
];

export function Institutions() {
  return (
    <>
      <div className="container">
        <table>
          <thead>
            <tr>
              <th>Straße</th>
              <th>Hausnummer</th>
              <th>Stadt</th>
              <th>PLZ</th>
              <th>Vorname</th>
              <th>Nachname</th>
              <th>Telefonnummer</th>
              <th>Schulverwaltungsbezirk</th>
            </tr>
          </thead>
          {institutions.map((institution, index) => {
            return (
              <tbody>
                <tr key={index}>
                  <td>{institution.address.street}</td>
                  <td>{institution.address.streetNumber}</td>
                  <td>{institution.address.town}</td>
                  <td>{institution.address.zipCode}</td>
                  <td>{institution.firstName}</td>
                  <td>{institution.lastName}</td>
                  <td>{institution.phoneNumber}</td>
                  <td>
                    {institution.schoolAdministrativeDistrict ? "Ja" : "Nein"}
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </>
  );
}
