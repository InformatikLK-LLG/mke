import { createContext, useContext, useEffect, useState } from "react";

import axios from "axios";

export type Privilege = {
  id:
    | "INSTITUTION_READ"
    | "INSTITUTION_WRITE"
    | "CUSTOMER_READ"
    | "CUSTOMER_WRITE"
    | "USER_READ"
    | "USER_WRITE"
    | "BOOKING_READ"
    | "BOOKING_WRITE"
    | "INVENTORY_READ"
    | "INVENTORY_WRITE"
    | "INVITE_READ"
    | "INVITE_WRITE"
    | "ROLE_WRITE";
};

export type Role = {
  id: string;
  privileges: Array<Privilege>;
};

type User =
  | {
      firstName: string;
      lastName: string;
      email: string;
      username: string;
      password: string;
      roles: Array<Role>;
    }
  | undefined;

type Invite =
  | { inviteCode: string; encodedInviteCode: number; email: string }
  | undefined;

type Auth = {
  user: User;
  isLoading: boolean;
  signin: (email: string, password: string) => Promise<User>;
  signout: () => void;
  revokeAll: () => void;
  validateInviteCode: (code: number) => boolean;
  verifyRegistrationEligibility: (
    code: number,
    email: string
  ) => Promise<Invite>;
  register: (
    code: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<User>;
  skipFirstRegisterStep: (inviteCode: string) => Promise<Invite>;
};

export const hasInstitutionWrite = (user: User) => {
  return user?.roles.some((role) =>
    role.privileges.some((privilege) => privilege.id === "INSTITUTION_WRITE")
  );
};

const defaultAuth: Auth = {
  user: undefined,
  isLoading: true,
  signin: () => {
    return new Promise(() => undefined);
  },
  signout: () => {
    return;
  },
  revokeAll: () => {
    return;
  },
  verifyRegistrationEligibility: () => {
    return new Promise(() => undefined);
  },
  skipFirstRegisterStep: () => {
    return new Promise(() => undefined);
  },
  validateInviteCode: () => {
    return false;
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
  const [isLoading, setIsLoading] = useState(true);

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

  const signout = async () => {
    try {
      await axios.delete("http://localhost:8080/profile/logout");
    } catch (error) {
      console.error(error);
    } finally {
      setUser(undefined);
    }
  };

  const revokeAll = async () => {
    try {
      await axios.delete("http://localhost:8080/profile/revokeAll");
      setUser(undefined);
    } catch (error) {
      console.error(error);
    }
  };

  const validateInviteCode = (code: number) => {
    return true;
  };

  const verifyRegistrationEligibility = async (code: number, email: string) => {
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
    code: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await axios.post<User>(
        "http://localhost:8080/register",
        {
          code,
          firstName,
          lastName,
          email,
          password,
        }
      );
      setUser(response.data);
      return response.data;
    } catch (error) {
      return undefined;
    }
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.post<User>("http://localhost:8080/signin");
        setUser(response.data);
      } catch (error) {
        throw error;
      }
    }

    async function fetchNewJWT() {
      try {
        await axios.post("http://localhost:8080/profile/refreshToken");
        fetchUser();
      } catch (error) {
        setUser(undefined);
        console.error(error);
      }
    }

    async function doMagic() {
      setIsLoading(true);
      try {
        await fetchUser();
      } catch (error) {
        fetchNewJWT();
      } finally {
        setIsLoading(false);
      }
    }

    doMagic();
  }, []);

  return {
    user,
    isLoading,
    signin,
    signout,
    revokeAll,
    verifyRegistrationEligibility,
    validateInviteCode,
    register,
    skipFirstRegisterStep,
  };
}
