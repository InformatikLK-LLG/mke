import { FormInstitutionType } from "../pages/Institution";
import axios from "axios";
import { useQuery } from "react-query";

const useInstitution = (id: string) => {
  return useQuery(["institution", id], () =>
    axios.get<FormInstitutionType>("http://localhost:8080/institution", {
      params: { id },
    })
  );
};

export default useInstitution;
