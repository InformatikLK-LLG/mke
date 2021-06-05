import { createContext, useContext, useEffect, useState } from "react";

import axios from "axios";

type User =
  | {
      firstName: string;
      lastName: string;
      email: string;
      username: string;
      password: string;
    }
  | undefined;

type Invite = { inviteCode: string; code: number; email: string } | undefined;

type Auth = {
  user: User;
  signin: (email: string, password: string) => Promise<User>;
  signout: () => void;
  verifyRegistrationEligibility: (
    code: string,
    email: string
  ) => Promise<Invite>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<User>;
  skipFirstRegisterStep: (inviteCode: string) => Promise<Invite>;
};

const defaultAuth: Auth = {
  user: undefined,
  signin: () => {
    return new Promise(() => undefined);
  },
  signout: () => {
    return;
  },
  verifyRegistrationEligibility: () => {
    return new Promise(() => undefined);
  },
  skipFirstRegisterStep: () => {
    return new Promise(() => undefined);
  },
  register: () => {
    return new Promise(() => undefined);
  },
};

const authContext = createContext<Auth>(defaultAuth);

export default function ProvideAuth({ children }: { children: JSX.Element }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth(): Auth {
  const [user, setUser] = useState<User>();

  const signin = async (email: string, password: string) => {
    try {
      const response = await axios.post<User>("http://localhost:8080/login", {
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

  const verifyRegistrationEligibility = async (code: string, email: string) => {
    try {
      const response = await axios.get<Invite>("http://localhost:8080/invite", {
        params: { code, email },
      });
      return response.data;
    } catch (error) {
      return undefined;
    }
  };

  const skipFirstRegisterStep = async (inviteCode: string) => {
    try {
      if (inviteCode) {
        const response = await axios.get<Invite>(
          "http://localhost:8080/invite",
          {
            params: { inviteCode },
          }
        );
        return response.data;
      }
    } catch (error) {}
  };
  // TODO maybe implement more methods for reset password, register, ...

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) return undefined;
    try {
      const response = await axios.post<User>("http://localhost:8080/user", {
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
    register,
    skipFirstRegisterStep,
  };
}
