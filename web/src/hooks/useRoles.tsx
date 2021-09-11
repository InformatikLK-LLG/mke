import { RoleType } from "./useAuth";
import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";

export type RoleSearchParams = { id?: string };

const useRoles = () => {
  const [searchParams, setSearchParams] = useState<
    RoleSearchParams | undefined
  >();
  return {
    ...useQuery(["roles", searchParams], async () => {
      const { data } = await axios.get<Array<RoleType>>(
        "http://localhost:8080/role",
        { params: searchParams }
      );
      return data;
    }),
    searchParams,
    setSearchParams,
  };
};

export default useRoles;
