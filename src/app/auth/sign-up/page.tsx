import { AuthWrapper } from "@/features/auth/components/auth-wrapper";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

const Page = () => {
    return (
        <AuthWrapper>
            <SignUpForm />
        </AuthWrapper>
    );
};

export default Page;
