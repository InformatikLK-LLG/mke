import { createContext, useContext, useEffect, useState } from "react";

import axios from "axios";

type register = (
  code: number,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  passwordRepeated: string
) => void;

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
  validateInviteCode: (code: number) => boolean;
  verifyRegistrationEligibility: (
    code: number,
    email: string
  ) => Promise<boolean>;
  register: (
    code: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<user>;
};

const defaultAuth: auth = {
  user: undefined,
  signin: () => {
    return new Promise(() => undefined);
  },
  signout: () => {
    return;
  },
  verifyRegistrationEligibility: () => {
    return new Promise(() => false);
  },
  validateInviteCode: () => {
    return false;
  },
  register: () => {
    return new Promise(() => undefined);
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
      return undefined;
    }
  };

  const signout = () => {
    // TODO implement logic for signout
    setUser(undefined);
  };

  const validateInviteCode = (code: number) => {
    return true;
  };

  const verifyRegistrationEligibility = async (code: number, email: string) => {
    try {
      const response = await axios.get<boolean>(
        "http://localhost:8080/invite",
        {
          params: { code, email },
        }
      );
      return response.data;
    } catch (error) {
      return false;
    }
  };
  // TODO maybe implement more methods for reset password, register, ...

  const register = async (
    code: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await axios.post<user>("http://localhost:8080/user", {
        firstName,
        lastName,
        email,
        password,
      });
      setUser(response.data);
      return response.data;
    } catch (error) {
      return undefined;
    }
  };

  useEffect(() => {
    // TODO logic to fetch user on mount
  });

  return {
    user,
    signin,
    signout,
    verifyRegistrationEligibility,
    validateInviteCode,
    register,
  };
}
