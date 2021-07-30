import { Outlet, useNavigate } from "react-router-dom";
import Table, { TableHeaders } from "../components/Table";
import useUsers, { UserSearchParams } from "../hooks/useUsers";

import { Role } from "../hooks/useAuth";
import axios from "axios";
import { useEffect } from "react";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: Array<Role>;
};

export default function User() {
  return <Outlet />;
}

export function Users() {
  const { data, isLoading, setSearchParams, error } = useUsers();
  const navigate = useNavigate();
  const tableHeaders: TableHeaders<User> = {
    firstName: { label: "Vorname", width: 1 },
    lastName: { label: "Nachname", width: 1 },
    email: { label: "Email", width: 1 },
    roles: {
      label: "Rollen",
      width: 1,
      format: (value: Array<Role>) => (
        <>
          {value
            .map((role) => role.id)
            .sort()
            .join(", ")}
        </>
      ),
    },
  };

  async function search(parameter?: keyof UserSearchParams, query?: string) {
    query = parameter === "roles" ? query?.replaceAll(/\s/g, "") : query;
    setSearchParams(
      (value) =>
        parameter &&
        (value ? { ...value, [parameter]: query } : { [parameter]: query })
    );
  }

  const searchParams: Array<
    { [key in keyof UserSearchParams]: "string" | "number" }
  > = [
    { firstName: "string" },
    { lastName: "string" },
    { email: "string" },
    { roles: "string" },
  ];

  return (
    <div className="container">
      <Table
        rows={data?.data || []}
        tableHeaders={tableHeaders}
        isLoading={isLoading}
        onRowClick={(row) => navigate(`./${row.id}`)}
        sort={["Vorname", "Nachname", "Email", "Rollen"]}
        search={search}
        searchParams={searchParams}
      />
    </div>
  );
}
