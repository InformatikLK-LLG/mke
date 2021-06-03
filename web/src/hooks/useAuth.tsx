import { createContext, useContext, useEffect, useState } from "react";

import axios from "axios";

type user = { firstName: string; lastName: string; email: string; username: string; password: string } | undefined;
type auth = {
  user: user;
  signin: (email: string, password: string) => void;
  signout: () => void;
};

const defaultAuth: auth = {
  user: undefined,
  signin: (email, password) => {
    return;
  },
  signout: () => {
    return;
  },
};

const authContext = createContext<auth>(defaultAuth);

export default function ProvideAuth({ children }: { children: JSX.Element }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth(): auth {
  const [user, setUser] = useState<user>();

  const signin = async (email: string, password: string) => {
    // TODO implement logic for signin
    const { data } = await axios.post("http://localhost:8080/login", { email, password });
    console.log(data);
    setUser(data as user);
  };

  const signout = () => {
    // TODO implement logic for signout
    setUser(undefined);
  };

  // TODO maybe implement more methods for reset password, register, ...

  useEffect(() => {
    // TODO logic to fetch user on mount
  });

  return { user, signin, signout };
}
