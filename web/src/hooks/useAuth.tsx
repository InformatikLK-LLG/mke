import { createContext, useContext, useEffect, useState } from "react";

type user = { email: string; password: string } | undefined;

type register = (
  code: number,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  passwordRepeated: string
) => void;

type auth = {
  user: user;
  signin: (email: string, password: string) => void;
  signout: () => void;
  register: register;
  validateInviteCode: (code: number) => boolean;
};

const defaultAuth: auth = {
  user: undefined,
  signin: () => {
    return;
  },
  signout: () => {
    return;
  },
  register: () => {
    return;
  },
  validateInviteCode: () => {
    return false;
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

  const signin = (email: string, password: string) => {
    // TODO implement logic for signin
    setUser({ email, password });
  };

  const signout = () => {
    // TODO implement logic for signout
    setUser(undefined);
  };

  const register: register = (
    code,
    firstName,
    lastName,
    email,
    password,
    passwordRepeated
  ) => {
    return;
  };

  const validateInviteCode = (code: number) => {
    // TODO check whether invite code is valid or not
    return true;
  };

  // TODO maybe implement more methods for reset password, register, ...

  useEffect(() => {
    // TODO logic to fetch user on mount
  });

  return { user, signin, signout, register, validateInviteCode };
}
