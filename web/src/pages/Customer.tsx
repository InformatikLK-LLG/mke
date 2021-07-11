import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import { Controller, useForm } from "react-hook-form";
import {
  CreateInstitution,
  FormInstitutionType,
  FormState,
  RenderInput,
  useButtonStyles,
  useInputStyles,
} from "./Institution";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  TextField,
  Theme,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import { Outlet, useNavigate } from "react-router-dom";
import Table, { TableHeaders } from "../components/Table";
import { useEffect, useState } from "react";

import { AnimatePresence } from "framer-motion";
import Button from "../components/Button";
import { EmailInputField } from "../components/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormErrorMessage from "../components/FormErrorMessage";
import axios from "axios";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faUniversity } from "@fortawesome/free-solid-svg-icons";
import useCustomers from "../hooks/useCustomers";

export type CustomerType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  businessPhone: string;
  institution: string;
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
  const { data, isLoading } = useCustomers(instCode);
  const navigate = useNavigate();
  return (
    <Table
      tableHeaders={tableHeaders}
      rows={data?.data || []}
      sort={["Vorname", "Nachname", "Email"]}
      onRowClick={(row) => navigate(`/customers/${row.id}`)}
      isLoading={isLoading}
    />
  );
}

export function CreateCustomer() {
  const {
    register,
    handleSubmit,
    clearErrors,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CustomerType>({ mode: "onChange" });
  const formInput = useInputStyles();
  const theme = useTheme();
  const formButton = useButtonStyles();
  const formState: FormState<CustomerType> = {
    clearErrors,
    control,
    errors,
    formInput,
    getValues,
    setValue,
  };
  const inputFields = useInputFields(theme);
  const [data, setData] = useState<Array<{ value: string; id?: string }>>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const institution = watch("institution");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get<Array<FormInstitutionType>>(
          "http://localhost:8080/institution"
        );
        console.log(data);
        const data2 = data.map((dataSingular) => {
          return {
            value: dataSingular.name,
            id: dataSingular.id,
          };
        });
        setData(data2);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [isDialogOpen]);

  useEffect(() => console.log(institution), [institution]);
  useEffect(() => console.log(data), [data]);

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
            <CreateInstitution
              onSubmit={(data) => {
                setValue("institution", data.name);
                setIsDialogOpen(false);
              }}
              defaultInstitution={{ name: institution }}
            />
          </DialogContent>
        </Dialog>
      )}
      <form
        onSubmit={handleSubmit((data) => {
          //TODO do stuff here
          console.log(data);
        })}
        style={{ width: "80%" }}
      >
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="flex-end"
          justify="center"
        >
          <Grid item xs={12} md={6} lg={6} className={inputFields.firstName}>
            {RenderInput({
              name: "firstName",
              placeholder: "Vorname",
              required: "Vorname muss angegeben werden",
              autofocus: true,
              icon: faEdit,
              formState,
            })}
          </Grid>

          <Grid item xs={12} md={6} lg={6} className={inputFields.institution}>
            <Controller
              control={control}
              name="institution"
              render={({ field }) => (
                <Autocomplete
                  autoComplete
                  includeInputInList
                  disableClearable
                  noOptionsText="nein. :("
                  forcePopupIcon={false}
                  options={data || []}
                  inputValue={field.value || ""}
                  onInputChange={(e, value) => field.onChange(value)}
                  getOptionLabel={(option) => option.value}
                  renderOption={(option) => {
                    console.log(option);
                    return option.id
                      ? `${option.value} — ${option.id}`
                      : `"${option.value}" hinzufügen`;
                  }}
                  filterOptions={(options) => {
                    const filtered = options.filter((option) =>
                      option.value
                        .toLowerCase()
                        .includes(field.value?.toLowerCase() || "")
                    );
                    field.value &&
                      field.value !== "" &&
                      filtered.push({
                        value: field.value,
                      });
                    return filtered;
                  }}
                  onChange={(e, option) => {
                    if (!option.id) {
                      setIsDialogOpen(true);
                    }
                    setValue("institution", option.value);
                  }}
                  renderInput={(params) =>
                    RenderInput({
                      name: "institution",
                      placeholder: "Name der Institution",
                      required: "Name der Institution muss angegeben werden",
                      icon: faUniversity,
                      autoComplete: "organization",
                      formState,
                      params,
                    })
                  }
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6} className={inputFields.lastName}>
            {RenderInput({
              name: "lastName",
              placeholder: "Nachname",
              required: "Nachname muss angegeben werden",
              icon: faEdit,
              formState,
            })}
          </Grid>

          <Grid item xs={12} md={6} lg={6} className={inputFields.email}>
            <EmailInputField
              clearErrors={clearErrors}
              emailErrors={errors.email}
              register={register}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6} className={inputFields.mobilePhone}>
            {RenderInput({
              name: "mobilePhone",
              placeholder: "Handynummer",
              required: "Handynummer muss angegeben werden",
              icon: faEdit,
              formState,
            })}
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            className={inputFields.businessPhone}
          >
            {RenderInput({
              name: "businessPhone",
              placeholder: "Telefonnummer dienstlich",
              required: "Telefonnummer dienstlich muss angegeben werden",
              icon: faEdit,
              formState,
            })}
          </Grid>

          <Button
            textColor="white"
            backgroundColor={theme.palette.primary.main}
            type="submit"
            label="Erstellen"
            buttonStyle={formButton}
            disabled={!isValid}
          />
        </Grid>
      </form>
    </div>
  );
}
