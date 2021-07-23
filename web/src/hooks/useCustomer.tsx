import { CustomerType } from "../pages/Customer";
import axios from "axios";
import { useQuery } from "react-query";

const useCustomer = (id: string) => {
  return useQuery(["customer", id], () =>
    axios.get<CustomerType>(`http://localhost:8080/customer/${id}`)
  );
};

export default useCustomer;
