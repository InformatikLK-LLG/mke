import { Outlet, useNavigate } from "react-router-dom";
import Table, { TableHeaders } from "../components/Table";

import { Role } from "../hooks/useAuth";
import useUsers from "../hooks/useUsers";

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
  const { data, isLoading, setSearchParams } = useUsers();
  const navigate = useNavigate();
  const tableHeaders: TableHeaders<User> = {
    firstName: { label: "Vorname", width: 1 },
    lastName: { label: "Nachname", width: 1 },
    email: { label: "Email", width: 1 },
    roles: {
      label: "Rollen",
      width: 1,
      format: (value: Array<Role>) => (
        <>{value.map((role) => role.id).join(", ")}</>
      ),
    },
  };

  return (
    <div className="container">
      <Table
        rows={data?.data || []}
        tableHeaders={tableHeaders}
        isLoading={isLoading}
        onRowClick={(row) => navigate(`./${row.id}`)}
      />
    </div>
  );
}
