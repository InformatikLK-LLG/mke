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

export const useDetailsStyles = makeStyles({
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

  const formInput = useInputStyles();
  const detailsStyles = useDetailsStyles();

  const zipCode = watch("address.zipCode");
  const name = watch("name");

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
      // queryClient.invalidateQueries("institution");
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

  return (
    <div className={detailsStyles.enclosure}>
      <div className={detailsStyles.section}>
        <UpdateInstitutionForm data={data?.data} />
      </div>
      <Divider
        style={{ width: "80%" }}
        classes={{ root: detailsStyles.divider }}
      />
      <div className={detailsStyles.section}>
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
