import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/theme-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider>
            <TooltipProvider>
                { children }
            </TooltipProvider>
        </ThemeProvider>
    )
};