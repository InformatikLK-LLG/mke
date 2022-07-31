import { CustomerType } from "../pages/Customer";
import axios from "axios";
import { useQuery } from "react-query";

const useCustomer = (id: number) => {
  return useQuery(["customer", id], async () => {
    const { data } = await axios.get<CustomerType>(
      `http://localhost:8080/customer/${id}`
    );
    return data;
  });
};

export default useCustomer;
