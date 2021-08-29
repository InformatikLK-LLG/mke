import { Divider, Grid, useTheme } from "@material-ui/core";
import Form, { EmailInputField } from "../components/Form";
import { FormState, useButtonStyles, useInputStyles } from "./Institution";
import Table, { TableHeaders } from "../components/Table";
import { faEdit, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import useInvites, { InviteSearchParams } from "../hooks/useInvites";

import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useDetailsStyles } from "../components/InstitutionDetails";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useSnackbar } from "../Wrapper";
import { useState } from "react";

export type InviteType = { id: number; email: string; inviteCode: number };

export default function Invite() {
  return <Outlet />;
}

export function CreateInvite() {
  const formInput = useInputStyles();
  const formButton = useButtonStyles();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const {
    clearErrors,
    control,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm<{ email: string }>({
    mode: "onChange",
  });
  const formState: FormState<{ email: string }> = {
    clearErrors,
    control,
    errors,
    formInput,
    watch,
    setValue,
  };
  const inputs = [
    <Grid item xs>
      <EmailInputField formState={formState} />
    </Grid>,
  ];
  const [isLoading, setIsLoading] = useState(false);
  const { setMessage, setSnackbarOpen } = useSnackbar();
  return (
    <Form
      inputs={inputs}
      button={
        <Button
          type="submit"
          label="Erstellen"
          buttonStyle={formButton}
          isLoading={isLoading}
          backgroundColor={theme.palette.primary.main}
        />
      }
      onSubmit={handleSubmit(async (data, event) => {
        setIsLoading(true);
        try {
          const response = await axios.post(
            "http://localhost:8080/invite",
            data
          );
          if (response.status === 200) {
            setMessage("Erfolgreich eingeladen");
            setSnackbarOpen(true);
            queryClient.invalidateQueries("invites");
          }
        } catch (error) {
          setMessage("Fehler beim Einladen");
          setSnackbarOpen(true);
        } finally {
          setIsLoading(false);
        }
      })}
    />
  );
}

export function Invites() {
  const detailsStyles = useDetailsStyles();
  const { setMessage, setSnackbarOpen } = useSnackbar();
  const {
    data,
    isLoading,
    setSearchParams,
    searchParams: inviteSearchParams,
  } = useInvites();
  const [isDeleteLoading, setIsDeleteLoading] = useState<
    { [key in number]: boolean } | undefined
  >();
  const queryClient = useQueryClient();
  const searchParams: Array<
    { [key in keyof InviteSearchParams]: "string" | "number" }
  > = [{ email: "string", inviteCode: "number" }];
  const tableHeaders: TableHeaders<InviteType> = {
    email: {
      label: "Email",
      width: 3,
    },
    inviteCode: { label: "Code", width: 1 },
  };

  return (
    <div className={detailsStyles.enclosure}>
      <div className={detailsStyles.section}>
        <CreateInvite />
      </div>
      <Divider
        style={{ width: "80%" }}
        classes={{ root: detailsStyles.divider }}
      />
      <div className={detailsStyles.section}>
        <Table
          tableHeaders={tableHeaders}
          rows={data || []}
          buttons={[
            {
              onClick: async (row, event) => {
                try {
                  setIsDeleteLoading({ [row.id]: true });
                  await axios.delete("http://localhost:8080/invite", {
                    params: { id: row.id },
                  });
                  queryClient.invalidateQueries([
                    "invites",
                    inviteSearchParams,
                  ]);
                } catch (error) {
                  setMessage(
                    "Joah ging halt nicht zu löschen und so..., sorry."
                  );
                  setSnackbarOpen(true);
                } finally {
                  setIsDeleteLoading({ [row.id]: false});
                }
              },
              icon: <FontAwesomeIcon icon={faTrashAlt} />,
              isLoading: isDeleteLoading,
            },
          ]}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
