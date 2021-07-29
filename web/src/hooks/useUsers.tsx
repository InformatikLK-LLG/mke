import { User } from "../pages/User";
import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";

export type UsersSearchParams = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

const useUsers = () => {
  const [searchParams, setSearchParams] = useState<
    UsersSearchParams | undefined
  >();
  return {
    ...useQuery(["users"], () =>
      axios.get<Array<User>>("http://localhost:8080/user", {
        params: searchParams,
      })
    ),
    searchParams,
    setSearchParams,
  };
};

export default useUsers;
