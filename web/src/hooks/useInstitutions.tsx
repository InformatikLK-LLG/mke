import { useQuery, useQueryClient } from "react-query";

import { FormInstitutionType } from "../pages/Institution";
import axios from "axios";
import { useState } from "react";

export type InstitutionsSearchParams = {
  id?: string;
  schoolAdministrativeDistrict?: number;
  name?: string;
  "address.street"?: string;
};

const useInstitutions = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useState<
    InstitutionsSearchParams | undefined
  >();
  return {
    ...useQuery(
      ["institutions", searchParams],
      async () => {
        const { data } = await axios.get<Array<FormInstitutionType>>(
          "http://localhost:8080/institution",
          {
            params: searchParams,
          }
        );
        return data;
      },
      {
        onSuccess: (institutions) =>
          institutions.forEach((institution) => {
            queryClient.setQueryData(
              ["institution", institution.id],
              institution
            );
          }),
      }
    ),
    searchParams,
    setSearchParams,
  };
};

export default useInstitutions;
