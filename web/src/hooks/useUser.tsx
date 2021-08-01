import { User } from "../pages/User";
import axios from "axios";
import { useQuery } from "react-query";

const useUser = (id: string) => {
  return useQuery(["user", id], () =>
    axios.get<User>(`http://localhost:8080/user/${id}`)
  );
};

export default useUser;
