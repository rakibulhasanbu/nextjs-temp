import { cn } from "@/lib/utils"

type LogoProps = {
    size?: "sm" | "md" | "lg"
}

export const Logo = ({ size = "md" }: LogoProps) => {
    const sizeClasses = {
        sm: "text-xl",
        md: "text-2xl",
        lg: "text-3xl",
    }
    return (
        <span className={ cn("font-semibold text-3xl text-primary", sizeClasses[ size ]) }>
            LOGO
        </span>
    )
}