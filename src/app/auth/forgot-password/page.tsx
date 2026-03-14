
import { ForgotForm } from "@/features/auth/components/forgot-form";

import { AuthWrapper } from "@/features/auth/components/auth-wrapper";

const Page = () => {
    return (
        <AuthWrapper>
            <ForgotForm />
        </AuthWrapper>
    );
};

export default Page;
