import { User } from "../pages/User";
import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";

export type UserSearchParams = {
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: string;
};

const useUsers = () => {
  const [searchParams, setSearchParams] = useState<
    UserSearchParams | undefined
  >();
  return {
    ...useQuery(["users", searchParams], () =>
      axios.get<Array<User>>("http://localhost:8080/user", {
        params: searchParams,
      })
    ),
    searchParams,
    setSearchParams,
  };
};

export default useUsers;
