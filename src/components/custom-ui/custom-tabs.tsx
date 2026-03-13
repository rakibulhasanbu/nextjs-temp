"use client";

import { createContext, ReactNode, useContext } from "react";

import { cn } from "@/lib/utils";

type CustomTabsContextType = {
    activeTab: string;
    setActive: (value: string) => void;
};

const CustomTabsContext = createContext<CustomTabsContextType | undefined>(
    undefined
);

const useCustomTabsContext = () => {
    const context = useContext(CustomTabsContext);
    if (!context) {
        throw new Error(
            "CustomTabs components must be used within a CustomTabs component"
        );
    }
    return context;
};

type CustomTabsProps = {
    value: string;
    onValueChange: (value: string) => void;
    children: ReactNode;
    className?: string;
};

const CustomTabs = ({
    value,
    onValueChange,
    children,
    className,
}: CustomTabsProps) => {
    return (
        <CustomTabsContext.Provider
            value={ { activeTab: value, setActive: onValueChange } }
        >
            <div className={ className }>{ children }</div>
        </CustomTabsContext.Provider>
    );
};

type CustomTabsListProps = {
    children: ReactNode;
    className?: string;
};

const CustomTabsList = ({ children, className }: CustomTabsListProps) => {
    return (
        <div
            className={ cn(
                "flex items-center gap-1 border-b max-lg:w-[90vw] max-lg:overflow-x-auto md:gap-2 lg:gap-4 xl:gap-5 2xl:gap-6",
                className
            ) }
        >
            { children }
        </div>
    );
};

type CustomTabsTriggerProps = {
    value: string;
    children: ReactNode;
    className?: string;
    icon?: ReactNode;
};

const CustomTabsTrigger = ({
    value,
    children,
    className,
    icon,
}: CustomTabsTriggerProps) => {
    const { activeTab, setActive } = useCustomTabsContext();

    return (
        <button
            type="button"
            onClick={ () => setActive(value) }
            className={ cn(
                "text-foreground-secondary flex items-center justify-center gap-1.5 whitespace-nowrap border-b-2 border-transparent p-2 text-sm lg:text-base font-medium",
                activeTab === value && "border-primary text-primary",
                className
            ) }
        >
            { icon && <span className="hidden xl:block">{ icon }</span> }
            { children }
        </button>
    );
};

type CustomTabsContentProps = {
    value: string;
    children: ReactNode;
    className?: string;
};

const CustomTabsContent = ({
    value,
    children,
    className,
}: CustomTabsContentProps) => {
    const { activeTab } = useCustomTabsContext();

    if (activeTab !== value) return null;

    return <div className={ className }>{ children }</div>;
};

export { CustomTabs, CustomTabsContent, CustomTabsList, CustomTabsTrigger };
