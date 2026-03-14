import OTPVerifyForm from "@/features/auth/components/otp-form";

import { AuthWrapper } from "@/features/auth/components/auth-wrapper";

const Page = () => {
    return (
        <AuthWrapper>
            <OTPVerifyForm />
        </AuthWrapper>
    );
};

export default Page;
