"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { CustomFormError } from "@/components/custom-ui/custom-form-error";
import { CustomFormInput } from "@/components/custom-ui/custom-form-input";
import { registerAction } from "@/features/auth/actions";
import { useAuthSuccess } from "@/features/auth/hooks/use-auth-utils";
import { signUpFormSchema } from "@/features/auth/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CustomButton } from "@/components/custom-ui/custom-button";
import { Logo } from "@/components/shared/logo";
import { FieldGroup } from "@/components/ui/field";

type formValues = z.infer<typeof signUpFormSchema>;

export const SignUpForm = () => {
    const form = useForm<formValues>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const [ error, setError ] = useState<string | null>(null);
    const [ isPending, startTransition ] = useTransition();

    const onSuccess = useAuthSuccess();

    const onSubmit = (data: formValues) => {
        startTransition(async () => {
            const response = await registerAction(
                {
                    name: data.name.trim(),
                    email: data.email.trim(),
                    password: data.password.trim(),
                }
            );

            if (response.status === "success") {
                onSuccess({
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                    user: response.data.user,
                    path: "/auth/verify-email",
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
                        <h1 className="text-2xl font-semibold">Create an Account</h1>
                        <p className="text-sm text-muted-foreground">Create an account to get started</p>
                    </div>

                    <div className="grid gap-4">
                        <CustomFormInput
                            name="name"
                            label="Name"
                            placeholder="Enter your name"
                            type="text"
                            control={ form.control }
                            required
                        />

                        <CustomFormInput
                            name="email"
                            label="Email"
                            placeholder="Enter your email"
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

                        <CustomFormError message={ error || undefined } />

                        <CustomButton type="submit" className="w-full cursor-pointer" isLoading={ isPending }>
                            Sign Up
                        </CustomButton>
                    </div>

                    <div className="text-center text-sm">
                        Already have an account?{ " " }
                        <Link
                            href="/auth/sign-in"
                            className="text-primary/80 hover:text-primary pl-1 underline underline-offset-4"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </FieldGroup>
        </form>
    );
};