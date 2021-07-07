import { FormInstitutionType } from "../pages/Institution";
import axios from "axios";
import { useQuery } from "react-query";

<<<<<<< HEAD
<<<<<<< HEAD
const useInstitution = (id: string) => {
  return useQuery(["institution", id], () =>
    axios.get<FormInstitutionType>("http://localhost:8080/institution", {
      params: { id },
=======
const useInstitution = (instCode: string) => {
  return useQuery(["institution", instCode], () =>
    axios.get<FormInstitutionType>("http://localhost:8080/institution", {
      params: { instCode },
>>>>>>> fa12095 (Fetch data using react-query. Add ctrl-s as a shortcut for saving institution forms.)
=======
const useInstitution = (id: string) => {
  return useQuery(["institution", id], () =>
    axios.get<FormInstitutionType>("http://localhost:8080/institution", {
      params: { id },
>>>>>>> 10ee25e (Improve searching capabilities of table and add suspense-loading component.)
    })
  );
};

export default useInstitution;
