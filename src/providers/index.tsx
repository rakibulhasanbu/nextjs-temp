import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthInitiatorFromCookies } from "@/features/auth/components/auth-initiator-from-cookies";
import { TokenInitiatorInStore } from "@/features/auth/components/token-initiator-in-store";
import { AlertProvider } from "@/providers/AlertProvider";
import { StoreProvider } from "@/providers/store-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <StoreProvider>
            <ThemeProvider>
                <AuthInitiatorFromCookies>
                    <TokenInitiatorInStore>
                        <AlertProvider>
                            <TooltipProvider>
                                <Toaster richColors position="top-right" />
                                { children }
                            </TooltipProvider>
                        </AlertProvider>
                    </TokenInitiatorInStore>
                </AuthInitiatorFromCookies>
            </ThemeProvider>
        </StoreProvider>
    )
};