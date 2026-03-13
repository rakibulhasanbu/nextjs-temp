import React from "react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const CustomTooltip = ({
    children,
    text,
    sideOffset = 14,
    trigger,
    asChild = false,
    className,
}: {
    children: React.ReactNode;
    text?: string;
    sideOffset?: number;
    trigger?: React.ReactNode;
    asChild?: boolean;
    className?: string;
}) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="cursor-pointer" asChild={asChild}>
                    {trigger}
                </TooltipTrigger>
                <TooltipContent sideOffset={sideOffset}>
                    {text ? <p className="text-sm">{text}</p> : <div className={cn(className)}>{children}</div>}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default CustomTooltip;
