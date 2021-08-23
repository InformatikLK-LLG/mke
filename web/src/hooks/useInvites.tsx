import { InviteType } from "../pages/Invite";
import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";

export type InviteSearchParams = { email: string; inviteCode: number };

const useInvites = () => {
  const [searchParams, setSearchParams] = useState<
    InviteSearchParams | undefined
  >();
  return {
    ...useQuery(["invites", searchParams], async () => {
      const { data } = await axios.get<Array<InviteType>>(
        "http://localhost:8080/invite"
      );
      return data;
    }),
    searchParams,
    setSearchParams,
  };
};

export default useInvites;
