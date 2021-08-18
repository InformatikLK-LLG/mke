import { Role } from "./useAuth";
import axios from "axios";
import { useQuery } from "react-query";

const useRoles = () => {
  return {
    ...useQuery(["roles"], async () => {
      const { data } = await axios.get<Array<Role>>(
        "http://localhost:8080/role"
      );
      return data;
    }),
  };
};

export default useRoles;
