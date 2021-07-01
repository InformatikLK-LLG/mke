import { FormInstitutionType } from "../pages/Institution";
import axios from "axios";
import { useQuery } from "react-query";

const useInstitutions = () => {
  return useQuery("institutions", () =>
    axios.get<Array<FormInstitutionType>>("http://localhost:8080/institution")
  );
};

export default useInstitutions;
