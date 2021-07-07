import {
  FormState,
  RenderInput,
  useButtonStyles,
  useInputStyles,
} from "./Institution";
import {
  Grid,
  InputAdornment,
  TextField,
  Theme,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import { Outlet, useNavigate } from "react-router-dom";
import Table, { TableHeaders } from "../components/Table";

import { AnimatePresence } from "framer-motion";
import Button from "../components/Button";
import { EmailInputField } from "../components/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormErrorMessage from "../components/FormErrorMessage";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import useCustomers from "../hooks/useCustomers";
import { useForm } from "react-hook-form";

export type CustomerType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  businessPhone: string;
};

export const useInputFields = makeStyles((theme: Theme) => ({
  firstName: {},
  lastName: {},
  email: {},
  mobilePhone: {},
  businessPhone: {},
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
    firstName: { label: "Vorname" },
    lastName: { label: "Nachname" },
    email: { label: "Email" },
    mobilePhone: { label: "Handynummer" },
    businessPhone: { label: "Telefonnummer dienstlich" },
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

  return (
    <div className="container">
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
