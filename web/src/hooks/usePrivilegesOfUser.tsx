import { PrivilegeType } from "./useAuth";
import { UserType } from "../pages/User";
import axios from "axios";
import { useQuery } from "react-query";

const usePrivilegesOfUser = (user: UserType) => {
  return {
    ...useQuery(["userPrivileges", user], async () => {
      const { data } = await axios.get<Array<PrivilegeType>>(
        `http://localhost:8080/user/${user.id}/privileges`
      );
      return data;
    }),
  };
};

export default usePrivilegesOfUser;
