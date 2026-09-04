import React from "react";
import { cookies } from "next/headers";

import { User } from "@/features/auth/types";

import { TokenInitiatorInStore } from "@/components/providers/token-initiator-in-store";

type Props = {
  children: React.ReactNode;
};

export const AuthInitProvider = async ({ children }: Props) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const user = JSON.parse(cookieStore.get("user")?.value || "{}") as User;

  return (
    <TokenInitiatorInStore accessToken={accessToken} refreshToken={refreshToken} user={user}>
      {children}
    </TokenInitiatorInStore>
  );
};
