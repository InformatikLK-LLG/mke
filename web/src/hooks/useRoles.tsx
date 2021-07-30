import { Role } from "./useAuth";
import axios from "axios";
import { useQuery } from "react-query";

const useRoles = () => {
  return {
    ...useQuery(["roles"], () =>
      axios.get<Array<Role>>("http://localhost:8080/role")
    ),
  };
};

export default useRoles;
