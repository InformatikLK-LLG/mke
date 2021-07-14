import { Customer } from "../pages/Institution";
import axios from "axios";
import { useQuery } from "react-query";

const useCustomers = (instCode?: string) => {
  return useQuery("customers", () =>
    axios.get<Array<Customer>>(
      `http://localhost:8080${
        instCode ? "/institution/" + instCode : ""
      }/customer`
    )
  );
};

export default useCustomers;
