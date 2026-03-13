import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";

interface CustomLoadingProps {
    size?: "none" | "sm" | "md" | "lg";
    className?: string;
}

export const CustomLoading = ({
    size = "md",
    className,
}: CustomLoadingProps) => {
    return (
        <div
            className={ cn(
                "flex items-center justify-center",
                size === "none" && "min-h-0",
                size === "sm" && "min-h-[30dvh]",
                size === "md" && "min-h-[50dvh]",
                size === "lg" && "min-h-[90dvh]",
                className
            ) }
        >
            <Loader className="size-7 animate-spin text-primary" />
        </div>
    );
};
