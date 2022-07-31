import { RoleType } from "./useAuth";
import axios from "axios";
import { useQuery } from "react-query";

const useRole = (id?: string) => {
  return useQuery(["role", id], async () => {
    const { data } = await axios.get<RoleType>(
      `http://localhost:8080/role/${id}`
    );
    return data;
  });
};

export default useRole;
