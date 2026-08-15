import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthInitiatorFromCookies } from "@/features/auth/components/auth-initiator-from-cookies";
import { AlertProvider } from "@/providers/AlertProvider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryProvider>
            <ThemeProvider>
                <AuthInitiatorFromCookies>
                    <AlertProvider>
                        <TooltipProvider>
                            <Toaster richColors position="top-right" />
                            { children }
                        </TooltipProvider>
                    </AlertProvider>
                </AuthInitiatorFromCookies>
            </ThemeProvider>
        </QueryProvider>
    )
};