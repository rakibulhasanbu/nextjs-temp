import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthInitProvider } from "@/providers/auth-init-provider";
import { AlertProvider } from "@/providers/AlertProvider";
import { StoreProvider } from "@/providers/store-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <StoreProvider>
            <ThemeProvider>
                <AuthInitProvider>
                    <AlertProvider>
                        <TooltipProvider>
                            <Toaster  />
                            { children }
                        </TooltipProvider>
                    </AlertProvider>
                </AuthInitProvider>
            </ThemeProvider>
        </StoreProvider>
    )
};