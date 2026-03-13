import React from "react";

import { CheckCheck, Copy } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface CopyValueProps {
    label?: string;
    value: string;
    className?: string;
}

export const CopyValue = ({ value, className, label }: CopyValueProps) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`flex items-center gap-1 ${className || ""}`}>
            <Badge variant="outline">{label || value}</Badge>
            <button onClick={handleCopy} className="hover:bg-muted rounded p-1">
                {copied ? <CheckCheck className="size-4 text-green-500" /> : <Copy className="size-4" />}
            </button>
        </div>
    );
};
