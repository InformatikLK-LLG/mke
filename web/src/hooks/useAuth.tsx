import { createContext, useContext, useEffect, useState } from "react";

type user = { email: String; password: String } | undefined;
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

  const signin = (email: String, password: String) => {
    // TODO implement logic for signin
    setUser({ email, password });
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
