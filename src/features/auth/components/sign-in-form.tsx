"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { CustomFormError } from "@/components/custom-ui/custom-form-error";
import { CustomFormInput } from "@/components/custom-ui/custom-form-input";
import { loginAction } from "@/features/auth/actions";
import { useAuthSuccess } from "@/features/auth/hooks/use-auth-utils";
import { signInFormSchema } from "@/features/auth/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CustomButton } from "@/components/custom-ui/custom-button";
import { Logo } from "@/components/shared/logo";
import { FieldGroup } from "@/components/ui/field";

export const SignInForm = () => {
    const form = useForm<z.infer<typeof signInFormSchema>>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [ error, setError ] = useState<string | null>(null);
    const [ isPending, startTransition ] = useTransition();

    const onSuccess = useAuthSuccess();

    const onSubmit = (data: z.infer<typeof signInFormSchema>) => {
        startTransition(async () => {
            const response = await loginAction(data.email.trim(), data.password.trim());

            if (response.status === "success") {
                onSuccess({
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                    user: response.data.user,
                });
            } else {
                setError(response.error || "Something went wrong");
            }
        });
    };

    return (
        <form onSubmit={ form.handleSubmit(onSubmit) }>
            <FieldGroup>
                <div className="grid gap-6">
                    <Logo />

                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">Welcome Back</h1>
                        <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
                    </div>

                    <div className="grid gap-4">
                        <CustomFormInput
                            name="email"
                            label="Email"
                            placeholder="m@example.com"
                            type="email"
                            control={ form.control }
                            required
                        />
                        <CustomFormInput
                            name="password"
                            label="Password"
                            placeholder="********"
                            type="password"
                            control={ form.control }
                            required
                        />
                        <div className="flex items-center justify-end text-blue-500">
                            <Link
                                href="/auth/forgot-password"
                                className="ml-auto font-medium text-sm underline-offset-4 hover:underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        <CustomFormError message={ error || undefined } />

                        <CustomButton type="submit" className="w-full" isLoading={ isPending }>
                            Sign In
                        </CustomButton>
                    </div>

                    <div className="text-center text-sm">
                        Don&apos;t have an account?{ " " }
                        <Link
                            href="/auth/sign-up"
                            className="hover:text-primary text-primary/80 pl-1 underline underline-offset-4"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </FieldGroup>
        </form>
    );
};
