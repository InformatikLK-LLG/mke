import { useQuery, useQueryClient } from "react-query";

import { UserType } from "../pages/User";
import axios from "axios";
import { useState } from "react";

export type UserSearchParams = {
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: string;
};

const useUsers = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useState<
    UserSearchParams | undefined
  >();
  return {
    ...useQuery(
      ["users", searchParams],
      async () => {
        const { data } = await axios.get<Array<UserType>>(
          "http://localhost:8080/user",
          {
            params: searchParams,
          }
        );
        return data;
      },
      {
        onSuccess: (users) =>
          users.forEach((user) =>
            queryClient.setQueryData(["user", user.id], user)
          ),
      }
    ),
    searchParams,
    setSearchParams,
  };
};

export default useUsers;
