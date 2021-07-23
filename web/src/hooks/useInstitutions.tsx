import { FormInstitutionType } from "../pages/Institution";
import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";

export type InstitutionsSearchParams = {
  id?: string;
  schoolAdministrativeDistrict?: number;
  name?: string;
  "address.street"?: string;
};

const useInstitutions = () => {
  const [searchParams, setSearchParams] = useState<
    InstitutionsSearchParams | undefined
  >();
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
};

export default useInstitutions;
