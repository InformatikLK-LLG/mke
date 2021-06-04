import { createContext, useContext, useEffect, useState } from "react";

import axios from "axios";

type user =
  | {
      firstName: string;
      lastName: string;
      email: string;
      username: string;
      password: string;
    }
  | undefined;
type auth = {
  user: user;
  signin: (email: string, password: string) => Promise<user>;
  signout: () => void;
};

const defaultAuth: auth = {
  user: undefined,
  signin: (email, password) => {
    return new Promise(() => undefined);
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
    try {
      const response = await axios.post<user>("http://localhost:8080/login", {
        email,
        password,
      });
      setUser(response.data);
      return response.data;
    } catch (error) {
      setUser(undefined);
      return undefined;
    }
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
