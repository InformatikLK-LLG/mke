<<<<<<< HEAD
<<<<<<< HEAD
import { motion } from "framer-motion";

export default function FormErrorMessage({
=======
import { FormInstitutionType } from "../pages/Institution";
import { motion } from "framer-motion";

export default function FormErrorMessage<T>({
>>>>>>> 24beae5 (Add fadeout effect on validation messages. Cleanup)
=======
import { motion } from "framer-motion";

export default function FormErrorMessage({
>>>>>>> fee0a5b (Slightly improve autocompletion speed by limiting the search query to german results and restricting the possible responses. Clean up.)
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
