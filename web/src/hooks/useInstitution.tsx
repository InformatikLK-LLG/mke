import { FormInstitutionType } from "../pages/Institution";
import axios from "axios";
import { useQuery } from "react-query";

const useInstitution = (instCode: string) => {
  return useQuery(["institution", instCode], () =>
    axios.get<FormInstitutionType>("http://localhost:8080/institution", {
      params: { instCode },
    })
  );
};

export default useInstitution;
