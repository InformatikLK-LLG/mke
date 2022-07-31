import { QueryClient, useQuery, useQueryClient } from "react-query";

import { RoleType } from "./useAuth";
import axios from "axios";
import { useState } from "react";

export type RoleSearchParams = { name?: string };

const useRoles = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useState<
    RoleSearchParams | undefined
  >();
  return {
    ...useQuery(
      ["roles", searchParams],
      async () => {
        const { data } = await axios.get<Array<RoleType>>(
          "http://localhost:8080/role",
          { params: searchParams }
        );
        return data;
      },
      {
        onSuccess: (roles) =>
          roles.forEach((role) =>
            queryClient.setQueryData(["role", role.id], role)
          ),
      }
    ),
    searchParams,
    setSearchParams,
  };
};

export default useRoles;
