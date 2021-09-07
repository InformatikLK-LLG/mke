import { PrivilegeType } from "./useAuth";
import axios from "axios";
import { useQuery } from "react-query";

const usePrivileges = () => {
  return {
    ...useQuery(["privileges"], async () => {
      const { data } = await axios.get<Array<PrivilegeType>>(
        "http://localhost:8080/privilege"
      );
      return data;
    }),
  };
};

export default usePrivileges;
