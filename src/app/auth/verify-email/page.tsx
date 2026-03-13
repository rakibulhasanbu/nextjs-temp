import OTPVerifyForm from "@/features/auth/components/otp-form";

import { Card, CardContent } from "@/components/ui/card";

export default function VerifyEmail () {
    return (
        <div className="container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0">
            <Card>
                <CardContent className="pt-6">
                    <OTPVerifyForm />
                </CardContent>
            </Card>
        </div>
    );
}
