import { User } from "../pages/User";
import axios from "axios";
import { useQuery } from "react-query";

const useUser = (id: string) => {
  return useQuery(["user", id], async () => {
    const { data } = await axios.get<User>(`http://localhost:8080/user/${id}`);
    return data;
  });
};

export default useUser;
