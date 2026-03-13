import { useRouter, useSearchParams } from "next/navigation";

import { setTokens, setUser } from "@/features/auth/slice";
import { useAppDispatch } from "@/redux/hook";
import { User } from "@/features/auth/types";

export const useAuthSuccess = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const dispatch = useAppDispatch();

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
        dispatch(setTokens({ accessToken, refreshToken }));

        if (user) {
            dispatch(setUser(user));
        }

        setTimeout(() => {
            router.replace(path || callbackUrl);
        }, 0);
    };

    return onSuccess;
};
