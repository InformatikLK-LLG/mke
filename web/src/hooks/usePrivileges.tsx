import { Privilege } from "./useAuth";
import { User } from "../pages/User";
import axios from "axios";
import { useQuery } from "react-query";

const usePrivileges = (user: User) => {
  return {
    ...useQuery(["privileges", user], () =>
      axios.get<Array<Privilege>>(
        `http://localhost:8080/user/${user.id}/privileges`
      )
    ),
  };
};

export default usePrivileges;
