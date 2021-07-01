import { Controller, useForm } from "react-hook-form";
import {
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import {
  FormInstitutionType,
  FormState,
  RenderInput,
  useButtonStyles,
  useInputFields,
  useInputStyles,
} from "../pages/Institution";
import axios, { AxiosResponse } from "axios";
import {
  faMapMarkerAlt,
  faQuestion,
  faUniversity,
  faVoicemail,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "./Loading";
import { faKeyboard } from "@fortawesome/free-regular-svg-icons";
import { useHeader } from "../Wrapper";
import useInstitution from "../hooks/useInstitution";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";

const useInstitutionStyles = makeStyles({
  toggleLabel: {
    "& > span::selection": {
      backgroundColor: "transparent",
    },
  },
});

export function InstitutionOverlay({
  instCode,
  data,
}: {
  instCode: string;
  data?: AxiosResponse<FormInstitutionType>;
}) {
  const defaultValues = data
    ? data.data
    : {
        id: "",
        name: "",
        phoneNumber: "",
        schoolAdministrativeDistrict: false,
        address: { street: "", streetNumber: "", town: "", zipCode: "" },
      };

  const {
    handleSubmit,
    setValue,
    control,
    watch,
    getValues,
    formState: { errors, isValid },
    clearErrors,
    reset,
    trigger,
  } = useForm<FormInstitutionType>({
    mode: "onChange",
    defaultValues,
  });
  const navigate = useNavigate();
  const header = useHeader();

  const [disabled, setDisabled] = useState(true);

  const theme = useTheme();
  const inputFields = useInputFields(theme);
  const formInput = useInputStyles();
  const formButton = useButtonStyles();
  const institutionStyles = useInstitutionStyles();

  const zipCode = watch("address.zipCode");
  const name = watch("name");
  const [controlPressed, setControlPressed] = useState(false);

  const formState: FormState<FormInstitutionType> = {
    clearErrors,
    control,
    errors,
    formInput,
    getValues,
    setValue,
    zipCode,
  };

  useEffect(() => {
    header.setHeader(name);
  }, [name, header]);

  const queryClient = useQueryClient();

  const updateData = async (data?: FormInstitutionType) => {
    const values = data ? data : getValues();
    try {
      const response = await axios.put<FormInstitutionType>(
        "http://localhost:8080/institution",
        values
      );
      queryClient.invalidateQueries("institutions");
    } catch (error) {
      console.log(error);
    }

    console.log("hello, it's me");
  };

  return (
    <div className="container">
      <form
        onSubmit={handleSubmit((data) => {
          updateData(data);
          navigate("/institutions");
        })}
        style={{ width: "80%" }}
        onKeyDown={(event) => {
          if (event.code === "KeyS" && controlPressed) {
            event.preventDefault();
            trigger();
            if (isValid) {
              updateData();
              navigate("/institutions");
            }
          }
          event.key === "Control" && setControlPressed(true);
        }}
        onKeyUp={(event) => {
          event.key === "Control" && setControlPressed(false);
        }}
      >
        <Grid
          container
          spacing={3}
          direction="row"
          alignItems="flex-end"
          justify="center"
        >
          <Grid item container xs={12} justify="flex-end">
            <FormControlLabel
              control={
                <Switch
                  checked={!disabled}
                  onChange={() => {
                    if (!disabled) updateData();
                    setDisabled((value) => !value);
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
          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            className={inputFields.institutionName}
          >
            {RenderInput({
              name: "name",
              placeholder: "Name",
              autocompletePlaces: "school",
              required: "Institutions-Name muss angegeben werden",
              autofocus: true,
              icon: faUniversity,
              autoComplete: "organization",
              formState,
              disabled,
            })}
          </Grid>

          <Grid item xs={12} md={6} lg={6} className={inputFields.instCode}>
            {RenderInput({
              name: "id",
              placeholder: "INST-Code",
              required: "INST-Code muss angegeben werden",
              icon: faKeyboard,
              formState,
              disabled: true,
            })}
          </Grid>

          <Grid item xs={12} md={6} lg={6} className={inputFields.phoneNumber}>
            {RenderInput({
              name: "phoneNumber",
              placeholder: "Telefonnummer",
              required: "Telefonnummer muss angegeben werden",
              icon: faVoicemail,
              autoComplete: "tel",
              formState,
              disabled,
            })}
          </Grid>

          <Grid item xs={12} md={6} lg={4} className={inputFields.street}>
            {RenderInput({
              name: "address.street",
              placeholder: "Straße",
              autocompletePlaces: "address",
              required: "Straße muss angegeben werden",
              icon: faMapMarkerAlt,
              autoComplete: "address-line1",
              formState,
              disabled,
            })}
          </Grid>

          <Grid item xs={12} md={6} lg={2} className={inputFields.streetNumber}>
            {RenderInput({
              name: "address.streetNumber",
              placeholder: "Hausnummer",
              required: "Hausnummer muss angegeben werden",
              icon: faMapMarkerAlt,
              autoComplete: "address-line2",
              formState,
              disabled,
            })}
          </Grid>

          <Grid item xs={12} md={6} lg={4} className={inputFields.town}>
            {RenderInput({
              name: "address.town",
              placeholder: "Stadt",
              required: "Stadt muss angegeben werden",
              icon: faMapMarkerAlt,
              autoComplete: "address-level2",
              formState,
              disabled,
            })}
          </Grid>

          <Grid item xs={12} md={6} lg={2} className={inputFields.zipCode}>
            {RenderInput({
              name: "address.zipCode",
              placeholder: "Postleitzahl",
              required: "Postleitzahl muss angegeben werden",
              icon: faMapMarkerAlt,
              autoComplete: "postal-code",
              formState,
              disabled,
            })}
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            className={inputFields.schoolAdministrativeDistrict}
          >
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
                    disabled={disabled}
                    startAdornment={
                      <InputAdornment position="start">
                        <FontAwesomeIcon
                          icon={faQuestion}
                          className="inputIcon"
                        />
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
          </Grid>
        </Grid>

        <Button
          type="submit"
          label="Speichern"
          buttonStyle={formButton}
          textColor="white"
          backgroundColor={theme.palette.primary.main}
          disabled={disabled || !isValid}
        />
      </form>
    </div>
  );
}
