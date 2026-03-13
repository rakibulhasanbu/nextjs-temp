import { cn } from "@/lib/utils";
import { Dot } from "lucide-react";

interface FormErrorProps {
    message?: string;
}

export const CustomFormError = ({ message }: FormErrorProps) => {
    if (!message) return null;

    let parsedMessages: string[] = [];

    // First check if it's a plain error message
    if (message.startsWith("Error:")) {
        // Remove 'Error: ' prefix and any auth.js URL references
        parsedMessages = [
            message.replace(/^Error: /, "").replace(/\. Read more at https:\/\/errors\.authjs\.dev#autherror.*/, ""),
        ];
    } else {
        try {
            const parsedMessage = JSON.parse(message);

            if (parsedMessage && Array.isArray(parsedMessage.messages)) {
                parsedMessages = parsedMessage.messages;
            } else if (parsedMessage && parsedMessage.errors) {
                for (const key in parsedMessage.errors) {
                    if (parsedMessage.errors[ key ]) {
                        parsedMessages.push(
                            ...parsedMessage.errors[ key ].map((err: { message: string }) => err.message)
                        );
                    }
                }
            }
            if (parsedMessages.length === 0) {
                parsedMessages = [ parsedMessage.code ];
            }
        } catch {
            parsedMessages = [ message ];
        }
    }

    return (
        <div
            className={ cn(
                "text-sm",
                "flex flex-col items-start gap-y-1 rounded-sm",
                "bg-destructive/15 text-destructive",
                "px-5 py-4"
            ) }
        >
            { parsedMessages.map((msg, index) => (
                <p key={ index } className={ cn("center flex gap-1") }>
                    { parsedMessages.length > 1 && <Dot /> }
                    { msg }
                </p>
            )) }
        </div>
    );
};
