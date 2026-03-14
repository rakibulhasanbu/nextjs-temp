"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { CustomOTPFormInput } from "@/components/custom-ui/custom-OTP-form-input";
import { verifyEmailAction } from "@/features/auth/actions";
import { useReSendVerificationSignupOTPMutation } from "@/features/auth/api";
import { useAuthSuccess } from "@/features/auth/hooks/use-auth-utils";
import { logoutThunkWithoutReload } from "@/features/auth/slice";
import { UserRole } from "@/features/auth/types";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CustomButton } from "@/components/custom-ui/custom-button";
import { Logo } from "@/components/shared/logo";
import { FieldGroup } from "@/components/ui/field";
import { useTimeCounter } from "@/hooks/use-time-counter";
import { ErrorResponse } from "@/redux/types";

const FormSchema = z.object({
    otp: z.string().min(4, {
        message: "ওটিপি কোড দিতে হবে।",
    }),
});

const OTPVerifyForm = () => {
    const router = useRouter();
    const user = useAppSelector((state) => state?.auth?.user);
    const email = user?.email;
    const isAdmin = user?.role === UserRole.ADMIN;
    const redirectPath = isAdmin ? "/overview" : "/onboarding";

    const dispatch = useAppDispatch();
    const [ isOtpSent, setIsOtpSent ] = useState(false);
    const { countingTime, isEnd, reset } = useTimeCounter(30, isOtpSent);

    const [ resendSuccess, setResendSuccess ] = useState(false);
    const [ isPending, startTransition ] = useTransition();
    const [ reSendVerificationSignupOTP, { isLoading: isResendLoading } ] = useReSendVerificationSignupOTPMutation();
    const onSuccess = useAuthSuccess();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            otp: "",
        },
    });

    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (!email || email.trim() === "") {
            return handleBackToSignIn();
        }

        startTransition(async () => {
            const response = await verifyEmailAction(email, Number(data.otp));

            if (response.status === "success") {
                toast.success("Verification has been successfully completed.");
                onSuccess({
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                    user: response.data.user,
                    path: redirectPath,
                });
            } else {
                if (response.error?.status === 406) {
                    handleResendOpt();
                    form.reset();
                    toast.error("The verification code has been resent.");
                } else {
                    form.setError("otp", { message: response.error || "Invalid OTP. Please try again." });
                }
            }
        });
    };

    const handleResendOpt = async () => {
        if (!email || email.trim() === "") {
            form.setError("otp", { message: "You are not authorized" });
            return handleBackToSignIn();
        }

        form.clearErrors("otp");
        setResendSuccess(false);

        await reSendVerificationSignupOTP({ email: user.email })
            .unwrap()
            .then(() => {
                toast.success("OTP code has been sent.");
                setResendSuccess(true);
                setIsOtpSent(true);
                reset();
                // Hide success message after 5 seconds
                setTimeout(() => setResendSuccess(false), 5000);
            })
            .catch((err: ErrorResponse) => {
                toast.error(err.message || "OTP code has not been sent.");
                setResendSuccess(false);
                setIsOtpSent(false);
            });
    };

    const handleBackToSignIn = () => {
        dispatch(logoutThunkWithoutReload());
        setTimeout(() => {
            router.replace("/auth/sign-in");
        }, 100);
    };

    return (
        <form onSubmit={ form.handleSubmit(handleSubmit) }>
            <FieldGroup>
                <Logo />

                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">Verification Code</h1>
                    <p className="text-sm text-muted-foreground">We&apos;ve sent a verification code to <span className="font-semibold">{ email || "your email address" }</span></p>
                </div>

                <CustomOTPFormInput pattern={ REGEXP_ONLY_DIGITS } control={ form.control } name="otp" />

                { resendSuccess && (
                    <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 shrink-0" />
                            <span>
                                Verification email resent successfully to <strong>{ email }</strong>. Please check your
                                inbox.
                            </span>
                        </div>
                    </div>
                ) }

                <CustomButton isLoading={ isPending } className="w-full" type="submit">
                    Verify Email
                </CustomButton>

                <div className="space-y-2">
                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Didn&apos;t receive the code? </span>
                        <button
                            type="button"
                            onClick={ handleResendOpt }
                            disabled={ isResendLoading || (isOtpSent && !isEnd) }
                            className="text-primary font-semibold hover:underline disabled:opacity-50"
                        >
                            { isResendLoading ? "Sending..." : "Resend" }
                        </button>
                        { isOtpSent && !isEnd && <span className="text-muted-foreground ml-1">(after { countingTime }s)</span> }
                    </div>

                    <div className="text-center text-sm flex items-center justify-center gap-2">
                        <span className="text-muted-foreground block">OR</span>
                        <Link href="/auth/sign-in" className="text-primary font-semibold hover:underline">Back to Sign In</Link>
                    </div>
                </div>

            </FieldGroup>
        </form>
    );
};

export default OTPVerifyForm;
