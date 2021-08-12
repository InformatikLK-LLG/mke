import { Privilege } from "./useAuth";
import axios from "axios";
import { useQuery } from "react-query";

const usePrivileges = () => {
  return {
    ...useQuery(["privileges"], () =>
      axios.get<Array<Privilege>>("http://localhost:8080/privilege")
    ),
  };
};

export default usePrivileges;
