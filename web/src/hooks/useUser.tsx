import { UserType } from "../pages/User";
import axios from "axios";
import { useQuery } from "react-query";

const useUser = (id: number) => {
  return useQuery(["user", id], async () => {
    const { data } = await axios.get<UserType>(
      `http://localhost:8080/user/${id}`
    );
    return data;
  });
};

export default useUser;
