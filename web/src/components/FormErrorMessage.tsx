export default function FormErrorMessage({
  message,
}: {
  message: string | undefined;
}) {
  return <span className="validationMessage">{message}</span>;
}
