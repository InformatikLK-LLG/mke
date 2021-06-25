import { FormInstitutionType } from "../pages/Institution";
import { motion } from "framer-motion";

export default function FormErrorMessage<T>({
  message,
  name,
}: {
  message?: string;
  name: string;
}) {
  return (
    <motion.span
      key={name}
      className="validationMessage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {message}
    </motion.span>
  );
}
