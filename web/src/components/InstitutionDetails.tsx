import { Divider, makeStyles } from "@material-ui/core";
import {
  FormInstitutionType,
  UpdateInstitutionForm,
} from "../pages/Institution";

import { AxiosResponse } from "axios";
import Table from "./Table";
import useCustomers from "../hooks/useCustomers";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHeader } from "../Wrapper";
import { useNavigate } from "react-router-dom";

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
  data?: FormInstitutionType;
}) {
  const defaultValues = data
    ? data
    : {
        id: "",
        name: "",
        phoneNumber: "",
        schoolAdministrativeDistrict: false,
        address: { street: "", streetNumber: "", town: "", zipCode: "" },
      };

  const { setValue, watch, getValues } = useForm<FormInstitutionType>({
    mode: "onChange",
    defaultValues,
  });
  const navigate = useNavigate();
  const header = useHeader();

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

  const { data: customers, isLoading: customersIsLoading } = useCustomers(
    getValues("id")
  );

  return (
    <div className={detailsStyles.enclosure}>
      <div className={detailsStyles.section}>
        <UpdateInstitutionForm data={data} />
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
          rows={customers || []}
          sort={["Vorname", "Nachname", "Email"]}
          onRowClick={(row) => navigate(`/customers/${row.id}`)}
          isLoading={customersIsLoading}
        />
      </div>
    </div>
  );
}
