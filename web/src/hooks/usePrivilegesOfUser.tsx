import { Privilege } from "./useAuth";
import { User } from "../pages/User";
import axios from "axios";
import { useQuery } from "react-query";

const usePrivilegesOfUser = (user: User) => {
  return {
    ...useQuery(["userPrivileges", user], async () => {
      const { data } = await axios.get<Array<Privilege>>(
        `http://localhost:8080/user/${user.id}/privileges`
      );
      return data;
    }),
  };
};

export default usePrivilegesOfUser;
