import Image from "next/image";
import { useRouter } from "next/navigation";
import emptyState from "@/assets/images/empty.png";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CustomErrorOrEmptyProps {
    title?: string;
    description?: string;
    isError?: boolean;
    isTryAgain?: boolean;
    onRetry?: () => void;
    className?: string;
}

const CustomErrorOrEmpty = ({
    title = "No Data Found",
    description = "There are no items to display at this time.",
    isError = false,
    isTryAgain = false,
    onRetry,
    className,
}: CustomErrorOrEmptyProps) => {
    const router = useRouter();
    return (
        <div className={ cn("center h-[60vh] flex-col", className) }>
            <Image
                src={ emptyState }
                alt="empty state"
                width={ 400 }
                height={ 400 }
                className="opacity-80 transition-transform duration-300 hover:scale-110"
            />
            <h1 className={ cn("text-gradient mt-8 text-2xl font-medium", isError && "from-rose-400 to-red-500") }>
                { title }
            </h1>
            <p className="text-icon max-w-lg text-center text-lg leading-relaxed">{ description }</p>
            { isTryAgain && (
                <Button
                    className="mt-6 w-[160px]"
                    onClick={ () => {
                        if (onRetry) onRetry();
                        else router.refresh();
                    } }
                >
                    Try Again
                </Button>
            ) }
        </div>
    );
};

export default CustomErrorOrEmpty;
