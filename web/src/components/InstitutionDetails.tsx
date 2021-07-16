import { Controller, useForm } from "react-hook-form";
import {
  CreateInstitution,
  FormInstitutionType,
  FormState,
  RenderInput,
  UpdateInstitutionForm,
  useButtonStyles,
  useInputStyles,
} from "../pages/Institution";
import {
  Divider,
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
import Form from "./Form";
import Loading from "./Loading";
import Table from "./Table";
import { faKeyboard } from "@fortawesome/free-regular-svg-icons";
import useCustomers from "../hooks/useCustomers";
import useEventListener from "@use-it/event-listener";
import { useHeader } from "../Wrapper";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";

export const useInstitutionStyles = makeStyles({
  toggleLabel: {
    "& > span::selection": {
      backgroundColor: "transparent",
    },
  },
  divider: { backgroundColor: "var(--border)" },
  section: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
    width: "70%",
    "&:last-child": { marginBottom: "3em" },
  },
  enclosure: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
    gap: "3em",
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
  const formInput = useInputStyles();
  const formButton = useButtonStyles();
  const institutionStyles = useInstitutionStyles();

  const zipCode = watch("address.zipCode");
  const name = watch("name");

  const formState: FormState<FormInstitutionType> = {
    clearErrors,
    control,
    errors,
    formInput,
    getValues,
    setValue,
  };

  useEffect(() => {
    header.setHeader(name);
  }, [name, header]);

  useEffect(() => {
    setValue("schoolAdministrativeDistrict", Boolean(zipCode));
    // zipCode is changing over runtime, though, eslint does not see it because watch returns a string
    // eslint-disable-next-line
  }, [zipCode]);

  const queryClient = useQueryClient();
  const { data: customers, isLoading: customersIsLoading } = useCustomers(
    getValues("id")
  );

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
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "s" && event.altKey && !disabled) {
      event.preventDefault();
      trigger();
      if (isValid) {
        updateData();
        navigate("/institutions");
      }
    }
  };

  useEventListener("keydown", onKeyDown);

  const inputs = [
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
    </Grid>,
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
        disabled,
      })}
    </Grid>,
    <Grid item xs={12} md={6} lg={6}>
      {RenderInput({
        name: "id",
        placeholder: "INST-Code",
        required: "INST-Code muss angegeben werden",
        icon: faKeyboard,
        formState,
        disabled: true,
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
        disabled,
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
        disabled,
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
        disabled,
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
        disabled,
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
        disabled,
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
              disabled={disabled}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
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
    <div className={institutionStyles.enclosure}>
      <div className={institutionStyles.section}>
        <Form
          inputs={inputs}
          button={
            <Button
              type="submit"
              label="Speichern"
              buttonStyle={formButton}
              textColor="white"
              backgroundColor={theme.palette.primary.main}
              disabled={disabled || !isValid}
            />
          }
          containerStyling={{
            spacing: 2,
            alignItems: "flex-end",
            direction: "row",
          }}
          onSubmit={handleSubmit((data) => {
            updateData(data);
            navigate("/institutions");
          })}
        />
        {/* <CreateInstitution defaultInstitution={data?.data} disabled /> */}
        <UpdateInstitutionForm data={data?.data} />
      </div>
      <Divider
        style={{ width: "80%" }}
        classes={{ root: institutionStyles.divider }}
      />
      <div className={institutionStyles.section}>
        <h3 style={{ alignSelf: "flex-start" }}>{`Kundinnen — ${name}`}</h3>
        <Table
          tableHeaders={{
            firstName: { label: "Vorname", width: 1 },
            lastName: { label: "Nachname", width: 1 },
            email: { label: "Email", width: 1 },
            mobilePhone: { label: "Handynummer", width: 1 },
            businessPhone: { label: "Telefonnummer dienstlich", width: 1 },
          }}
          rows={customers?.data || []}
          sort={["Vorname", "Nachname", "Email"]}
          onRowClick={(row) => navigate(`/customers/${row.id}`)}
          isLoading={customersIsLoading}
        />
      </div>
    </div>
  );
}
