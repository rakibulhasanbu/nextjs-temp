"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CustomFormInput } from "@/components/custom-ui/custom-form-input";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import Link from "next/link";

const formSchema = z.object({
    email: z.string().min(1, { message: "Please enter your email" }).email({ message: "Invalid email address" }),
});

export const ForgotForm = () => {
    const [ isLoading, setIsLoading ] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "" },
    });

    function onSubmit (data: z.infer<typeof formSchema>) {
        setIsLoading(true);
        console.log(data);

        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }

    return (
        <form onSubmit={ form.handleSubmit(onSubmit) }>
            <FieldGroup>
                <div className="grid gap-2">
                    <CustomFormInput
                        name="email"
                        label="Email"
                        placeholder="m@example.com"
                        type="email"
                        control={ form.control }
                        required
                    />
                    <Button className="mt-2" disabled={ isLoading }>
                        Continue
                    </Button>
                </div>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    Remember your password?{ " " }
                    <Link href="/auth/sign-in" className="hover:text-primary text-primary/80 pl-1 underline underline-offset-4">
                        Sign In
                    </Link>
                </p>
            </FieldGroup>
        </form>
    );
}
