import { AuthWrapper } from "@/features/auth/components/auth-wrapper";
import { SignInForm } from "@/features/auth/components/sign-in-form";

const Page = () => {
    return (
        <AuthWrapper>
            <SignInForm />
        </AuthWrapper>
    );
};

export default Page;
