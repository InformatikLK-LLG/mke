import "../styles/Table.css";

import {
  Checkbox,
  Grid,
  InputAdornment,
  TextField,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
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
    padding: "0.5em 10%",
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
    trigger,
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
  const address = watch("address.street");
  const name = watch("name");

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
          <Grid item xs={6}>
            <label>
              {errors.name && (
                <FormErrorMessage message={errors.name.message} />
              )}
              <Controller
                control={control}
                name="name"
                rules={{
                  required: "Name der Institution muss angegeben werden",
                }}
                render={({ field }) => (
                  <PlacesAutocomplete
                    watch={watch}
                    setValueInForm={setValue}
                    params={field}
                    searchFor="school"
                    value={name}
                  >
                    <TextField
                      placeholder="Name"
                      type="text"
                      className={formInput.input}
                      autoFocus
                    />
                  </PlacesAutocomplete>
                )}
              />
            </label>
          </Grid>

          <Grid item xs={6}>
            <label>
              {errors.id && <FormErrorMessage message={errors.id.message} />}
              <Controller
                control={control}
                name="id"
                rules={{
                  required:
                    "INST-Code muss angegeben werden und eindeutig sein oder so",
                }}
                render={({ field }) => (
                  <TextField
                    placeholder="INST-Code"
                    type="text"
                    className={formInput.input}
                    {...field}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon
                            className="inputIcon"
                            icon={faKeyboard}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </label>
          </Grid>

          <Grid item xs={6}>
            <label>
              {errors.phoneNumber && (
                <FormErrorMessage message={errors.phoneNumber.message} />
              )}
              <Controller
                control={control}
                name="phoneNumber"
                rules={{
                  required: "Telefonnummer muss angegeben werden",
                  pattern: {
                    value: /^[0-9\s-/]+$/,
                    message: "Telefonnummer nur aus Zahlen",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    placeholder="Telefonnummer"
                    className={formInput.input}
                    {...field}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon
                            className="inputIcon"
                            icon={faEdit}
                          />
                        </InputAdornment>
                      ),
                    }}
                    type="tel"
                  />
                )}
              />
            </label>
          </Grid>

          <Grid item xs={4}>
            <label>
              {errors.address?.street && (
                <FormErrorMessage message={errors.address.street.message} />
              )}
              <Controller
                control={control}
                name="address.street"
                rules={{ required: "Straße muss angegeben werden" }}
                render={({ field }) => (
                  <PlacesAutocomplete
                    watch={watch}
                    setValueInForm={setValue}
                    params={field}
                    searchFor="address"
                    value={address}
                  >
                    <TextField
                      placeholder="Straße"
                      type="text"
                      className={formInput.input}
                    />
                  </PlacesAutocomplete>
                )}
              />
            </label>
          </Grid>

          <Grid item xs={2}>
            <label>
              {errors.address?.streetNumber && (
                <FormErrorMessage
                  message={errors.address.streetNumber.message}
                />
              )}
              <Controller
                control={control}
                name="address.streetNumber"
                rules={{ required: "Hausnummer muss angegeben werden" }}
                render={({ field }) => (
                  <TextField
                    placeholder="Hausnummer"
                    type="text"
                    className={formInput.input}
                    {...field}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon
                            className="inputIcon"
                            icon={faEdit}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </label>
          </Grid>

          <Grid item xs={6}>
            <span>Liegt im Schulverwaltungsbezirk?</span>
            <Controller
              control={control}
              name="schoolAdministrativeDistrict"
              render={({ field }) => (
                <Checkbox
                  color="primary"
                  tabIndex={-1}
                  className={formInput.checkbox}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <label>
              {errors.address?.town && (
                <FormErrorMessage message={errors.address.town.message} />
              )}
              <Controller
                control={control}
                name="address.town"
                defaultValue=""
                rules={{ required: "Stadt muss angegeben werden" }}
                render={({ field }) => (
                  <TextField
                    placeholder="Stadt"
                    type="text"
                    className={formInput.input}
                    {...field}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon
                            className="inputIcon"
                            icon={faEdit}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </label>
          </Grid>

          <Grid item xs={2}>
            <label>
              {errors.address?.zipCode && (
                <FormErrorMessage message={errors.address.zipCode.message} />
              )}
              <Controller
                control={control}
                name="address.zipCode"
                rules={{
                  required: "Postleitzahl muss angegeben werden",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Was denn bei deiner Postleitzahl los?!",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    placeholder="Postleitzahl"
                    type="tel"
                    className={formInput.input}
                    {...field}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon
                            className="inputIcon"
                            icon={faEdit}
                          />
                        </InputAdornment>
                      ),
                      onChange: (e) => {
                        setValue(
                          "schoolAdministrativeDistrict",
                          e.target.value === "" ? false : true
                        );
                        field.onChange(e.target.value);
                      },
                    }}
                  />
                )}
              />
            </label>
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
