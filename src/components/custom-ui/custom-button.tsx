import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Link from "next/link";

type TCustomButton = {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    className?: string;
    isLoading?: boolean;
    disabled?: boolean;
    variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    // | "destructiveOutline"
    // | "accent";
    size?: "default" | "sm" | "lg" | "icon";
    icon?: React.ReactNode;
    type?: "button" | "submit" | "reset";
    target?: "_blank" | "_self" | "_parent" | "_top";
};

export const CustomButton = ({
    children,
    onClick,
    href,
    className,
    isLoading,
    disabled,
    variant = "default",
    size = "default",
    icon,
    type = "button",
    target = "_self",
}: TCustomButton) => {
    if (href) {
        return (
            <Link href={ href } target={ target }>
                <Button
                    className={ className }
                    disabled={ isLoading || disabled }
                    variant={ variant }
                    size={ size }
                >
                    { isLoading && <Loader className="h-4 w-4 animate-spin" /> }
                    { icon }
                    { children }
                </Button>
            </Link>
        );
    }
    return (
        <Button
            onClick={ onClick }
            className={ cn(type === "submit" && "cursor-pointer", className) }
            disabled={ isLoading || disabled }
            variant={ variant }
            size={ size }
            type={ type }
        >
            { isLoading && <Loader className="h-4 w-4 animate-spin" /> }
            { icon }
            { children }
        </Button>
    );
};
