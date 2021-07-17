import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import { Controller, useForm } from "react-hook-form";
import {
  CreateInstitution,
  CreateInstitutionForm,
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
import Form, { EmailInputField } from "../components/Form";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Table, { TableHeaders } from "../components/Table";
import useCustomers, { CustomerSearchParams } from "../hooks/useCustomers";
import { useEffect, useState } from "react";

import { AnimatePresence } from "framer-motion";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormErrorMessage from "../components/FormErrorMessage";
import Loading from "../components/Loading";
import axios from "axios";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faUniversity } from "@fortawesome/free-solid-svg-icons";

export type CustomerType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  businessPhone: string;
  institution: { name: string; id: string };
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
  const { data, isLoading, setSearchParams } = useCustomers(instCode);
  const navigate = useNavigate();
  const search = (searchParam: keyof CustomerSearchParams, query: string) => {
    setSearchParams({ [searchParam]: query });
  };

  return (
    <Table
      tableHeaders={tableHeaders}
      rows={data?.data || []}
      sort={["Vorname", "Nachname", "Email"]}
      onRowClick={(row) => navigate(`/customers/${row.id}`)}
      isLoading={isLoading}
      search={search}
      searchParams={["firstName", "lastName"]}
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
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<CustomerType>({ mode: "onChange" });
  const formInput = useInputStyles();
  const formButton = useButtonStyles();
  const theme = useTheme();
  const inputFields = useInputFields(theme);

  const navigate = useNavigate();

  const formState: FormState<CustomerType> = {
    clearErrors,
    control,
    errors,
    formInput,
    getValues,
    setValue,
  };
  const [options, setOptions] =
    useState<Array<{ value: string; id?: string }>>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    id?: string;
  }>();
  const institution = watch("institution");
  const inputs = [
    <Grid item xs={12} md={6} lg={6} className={inputFields.firstName}>
      {RenderInput({
        name: "firstName",
        placeholder: "Vorname",
        autoComplete: "given-name",
        required: "Vorname muss angegeben werden",
        autofocus: true,
        icon: faEdit,
        formState,
      })}
    </Grid>,

    <Grid item xs={12} md={6} lg={6} className={inputFields.institution}>
      <Controller
        control={control}
        name="institution.name"
        render={({ field }) => (
          <Autocomplete
            // value={selectedOption || { value: "" }}
            autoComplete
            includeInputInList
            disableClearable
            noOptionsText="nein. :("
            forcePopupIcon={false}
            options={options || []}
            inputValue={field.value || ""}
            onInputChange={(e, value) => {
              field.onChange(value);
              institution.id && setValue("institution.id", "");
            }}
            getOptionLabel={(option) => option.value}
            getOptionSelected={(option, value) => {
              // console.log( option, value, option.id === value.id && Boolean(value.id));
              return option.id === value.id && Boolean(value.id);
            }}
            renderOption={(option) =>
              option.id
                ? `${option.value} — ${option.id}`
                : `"${option.value}" hinzufügen`
            }
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
              } else setValue("institution.id", option.id);
              setValue("institution.name", option.value);
              setSelectedOption(option);
            }}
            renderInput={(params) =>
              RenderInput({
                name: "institution.name",
                placeholder: "Name der Institution",
                autoComplete: "organization",
                required: "Name der Institution muss angegeben werden",
                icon: faUniversity,
                formState,
                params,
              })
            }
          />
        )}
      />
    </Grid>,

    <Grid item xs={12} md={6} lg={6} className={inputFields.lastName}>
      {RenderInput({
        name: "lastName",
        placeholder: "Nachname",
        autoComplete: "family-name",
        required: "Nachname muss angegeben werden",
        icon: faEdit,
        formState,
      })}
    </Grid>,

    <Grid item xs={12} md={6} lg={6} className={inputFields.email}>
      <EmailInputField formState={formState} />
    </Grid>,

    <Grid item xs={12} md={6} lg={6} className={inputFields.mobilePhone}>
      {RenderInput({
        name: "mobilePhone",
        placeholder: "Handynummer",
        type: "tel",
        required: "Handynummer muss angegeben werden",
        icon: faEdit,
        formState,
      })}
    </Grid>,

    <Grid item xs={12} md={6} lg={6} className={inputFields.businessPhone}>
      {RenderInput({
        name: "businessPhone",
        placeholder: "Telefonnummer dienstlich",
        type: "tel",
        required: "Telefonnummer dienstlich muss angegeben werden",
        icon: faEdit,
        formState,
      })}
    </Grid>,
  ];

  const fetchData = async () => {
    try {
      const { data } = await axios.get<Array<FormInstitutionType>>(
        "http://localhost:8080/institution"
      );
      const data2 = data.map((dataSingular) => {
        return {
          value: dataSingular.name,
          id: dataSingular.id,
        };
      });
      setOptions(data2);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "s" && event.altKey) {
      event.preventDefault();
      trigger();
      if (isValid) {
        try {
          await axios.post<CustomerType>(
            "http://localhost:8080/customer",
            getValues()
          );
          navigate("/customer");
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

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
            <CreateInstitutionForm
              onSubmit={(data) => {
                fetchData();
                setValue("institution.name", data.name);
                setValue("institution.id", data.id);
                setIsDialogOpen(false);
              }}
              defaultInstitution={{ name: institution.name }}
            />
          </DialogContent>
        </Dialog>
      )}

      <Form
        inputs={inputs}
        onSubmit={handleSubmit(async (data) => {
          try {
            setIsLoading(true);
            const response = await axios.post<CustomerType>(
              "http://localhost:8080/customer",
              data
            );
            navigate("/customers");
          } catch (error) {
            console.log(error);
          } finally {
            setIsLoading(false);
          }
        })}
        maxWidth="200ch"
        button={
          <Button
            textColor="white"
            backgroundColor={theme.palette.primary.main}
            type="submit"
            label="Erstellen"
            buttonStyle={formButton}
            isLoading={isLoading}
          />
        }
      />
    </div>
  );
}

// export function ViewDetails() {
//   const { id } = useParams();
//   const { data, isLoading } = useCustomers(id);
//   // GET and stuff
//   // useEffect(() => {
//   //   console.log(data);
//   // }, [data]);
//   return isLoading ? <Loading /> : <CustomerOverlay id={} data={data} />;
// }
