import { FormInstitutionType } from "../pages/Institution";
import axios from "axios";
import { useQuery } from "react-query";
<<<<<<< HEAD
import { useState } from "react";

export type InstitutionsSearchParams = {
  id?: string;
  svb?: boolean;
  name?: string;
};
const useInstitutions = () => {
  const [searchParams, setSearchParams] = useState<InstitutionsSearchParams>();
  return {
    ...useQuery(["institutions", searchParams], () =>
      axios.get<Array<FormInstitutionType>>(
        "http://localhost:8080/institution",
        {
          params: searchParams,
        }
      )
    ),
    searchParams,
    setSearchParams,
  };
=======

const useInstitutions = () => {
  return useQuery("institutions", () =>
    axios.get<Array<FormInstitutionType>>("http://localhost:8080/institution")
  );
>>>>>>> fa12095 (Fetch data using react-query. Add ctrl-s as a shortcut for saving institution forms.)
};

export default useInstitutions;
