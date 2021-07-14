import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export default function Logout() {
  const auth = useAuth();

  useEffect(() => {
    auth.signout();
  });
  return <></>;
}
