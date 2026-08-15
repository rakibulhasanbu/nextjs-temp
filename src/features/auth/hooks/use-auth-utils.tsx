import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/features/auth/context";
import { User } from "@/features/auth/types";

export const useAuthSuccess = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const { setUser, setTokens } = useAuth();

    const onSuccess = ({
        accessToken,
        refreshToken,
        user,
        path,
    }: {
        accessToken: string;
        refreshToken: string;
        user: User | null;
        path?: string;
    }) => {
        setTokens({ accessToken, refreshToken });

        if (user) {
            setUser(user);
        }

        setTimeout(() => {
            router.replace(path || callbackUrl);
        }, 0);
    };

    return onSuccess;
};
