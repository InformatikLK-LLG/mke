import { Autocomplete, createFilterOptions } from "@material-ui/lab";
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
import { useForm } from "react-hook-form";

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
    formState: { errors },
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
  const [data, setData] = useState<Array<FormInstitutionType>>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get<Array<FormInstitutionType>>(
          "http://localhost:8080/institution"
        );
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  });
  const filter = createFilterOptions<FormInstitutionType>();

  return (
    <div className="container">
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle>Institution Erstellen</DialogTitle>
          <DialogContent>
            <CreateInstitution onSubmit={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      )}
      <form
        onSubmit={handleSubmit(
          ({ firstName, lastName, email, mobilePhone, businessPhone }) => {
            //FOO
          }
        )}
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
            <Autocomplete
              autoComplete
              freeSolo
              includeInputInList
              selectOnFocus
              clearOnBlur
              options={data || []}
              getOptionLabel={(option) =>
                `${option.name}${option.id && ` — ${option.id}`}`
              }
              filterOptions={(options, state) => {
                const filtered = filter(options, state);
                state.inputValue !== "" &&
                  filtered.push({
                    id: "",
                    name: `"${state.inputValue}" hinzufügen`,
                    phoneNumber: "",
                    schoolAdministrativeDistrict: false,
                    address: {
                      street: "",
                      streetNumber: "",
                      zipCode: "",
                      town: "",
                    },
                  });
                return filtered;
              }}
              onChange={(e, option) => {
                if (typeof option !== "string" && option && option.id === "") {
                  setIsDialogOpen(true);
                }
              }}
              renderInput={(params) =>
                RenderInput({
                  name: "institution",
                  placeholder: "Name der Institution",
                  required: "Name der Institution muss angegeben werden",
                  icon: faUniversity,
                  formState,
                  params,
                })
              }
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
            {RenderInput({
              name: "email",
              placeholder: "Email",
              required: "Email muss angegeben werden",
              icon: faEdit,
              formState,
            })}
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
          />
        </Grid>
      </form>
    </div>
  );
}
