"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

/**
 * CustomTextCopy Component
 *
 * Usage:
 * <CustomTextCopy
 *   text="https://buytiq.com/store/coffewala"
 *   copy={true}
 * />
 *
 * Props:
 * - text: string (required) - The text to display and copy
 * - copy: boolean (optional, default: true) - Whether to show the copy button
 * - className: string (optional) - Additional classes for the container
 * - textClassName: string (optional) - Additional classes for the text
 * - buttonClassName: string (optional) - Additional classes for the button
 */

interface CustomTextCopyProps {
    prefixText?: string;
    text: string;
    copy?: boolean;
    className?: string;
    textClassName?: string;
    buttonClassName?: string;
    href?: string;
}

export const CustomTextCopy = ({
    prefixText,
    text,
    copy = true,
    className,
    textClassName,
    buttonClassName,
    href,
}: CustomTextCopyProps) => {
    const [ copied, setCopied ] = useState(false);

    const handleCopy = async (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);

            // Reset to copy button after 2 seconds
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <div className={ cn("flex items-center gap-2", className) }>
            { prefixText && prefixText }
            <span
                onClick={ !href ? handleCopy : undefined }
                className={ cn(
                    "line-clamp-1 flex-1 text-base font-medium",
                    href ? "text-blue-500" : "cursor-pointer hover:text-blue-500",
                    textClassName
                ) }
            >
                { href ? (
                    <a href={ href } target="_blank" rel="noopener noreferrer">
                        { text }
                    </a>
                ) : (
                    text
                ) }
            </span>
            { copy && (
                <button
                    onClick={ handleCopy }
                    className={ cn("hover:text-primary cursor-pointer", buttonClassName) }
                    title={ copied ? "Copied!" : "Copy to clipboard" }
                >
                    { copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                    ) : (
                        <Copy className="text-muted-foreground h-4 w-4" />
                    ) }
                </button>
            ) }
        </div>
    );
};
