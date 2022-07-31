import { CustomerType } from "../pages/Customer";
import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";

export type CustomerSearchParams = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

const useCustomers = (instCode?: string) => {
  const [searchParams, setSearchParams] = useState<
    CustomerSearchParams | undefined
  >();
  return {
    ...useQuery(["customers", searchParams], () =>
      axios.get<Array<CustomerType>>(
        `http://localhost:8080${
          instCode ? "/institution/" + instCode : ""
        }/customer`,
        { params: searchParams }
      )
    ),
    searchParams,
    setSearchParams,
  };
};

export default useCustomers;
