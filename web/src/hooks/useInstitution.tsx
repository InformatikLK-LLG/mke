import { FormInstitutionType } from "../pages/Institution";
import axios from "axios";
import { useQuery } from "react-query";

const useInstitution = (id: string) => {
  return useQuery(["institution", id], async () => {
    const { data } = await axios.get<FormInstitutionType>(
      `http://localhost:8080/institution/${id}`
    );
    return data;
  });
};

export default useInstitution;
