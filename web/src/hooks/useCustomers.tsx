import { useQuery, useQueryClient } from "react-query";

import { CustomerType } from "../pages/Customer";
import axios from "axios";
import { useState } from "react";

export type CustomerSearchParams = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

const useCustomers = (instCode?: string) => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useState<
    CustomerSearchParams | undefined
  >();
  return {
    ...useQuery(
      ["customers", searchParams],
      async () => {
        const { data } = await axios.get<Array<CustomerType>>(
          `http://localhost:8080${
            instCode ? "/institution/" + instCode : ""
          }/customer`,
          { params: searchParams }
        );
        return data;
      },
      {
        onSuccess: (customers) =>
          customers.forEach((customer) =>
            queryClient.setQueryData(["customer", customer.id], customer)
          ),
      }
    ),
    searchParams,
    setSearchParams,
  };
};

export default useCustomers;
