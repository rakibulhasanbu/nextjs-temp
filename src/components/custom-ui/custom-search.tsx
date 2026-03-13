import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface CustomSearchProps {
    value?: string;
    onSearch?: (value: string) => void;
    placeholder?: string;
    className?: string;
    autoFocus?: boolean;
    debounceDelay?: number; // Delay in milliseconds
}

export const CustomSearch = ({
    onSearch,
    placeholder,
    className,
    value,
    autoFocus = false,
    debounceDelay = 500,
}: CustomSearchProps) => {
    const [ searchTerm, setSearchTerm ] = useState(value || "");
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handleSearchTerm = (value: string) => {
        setSearchTerm(value);

        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Immediately trigger search if value is empty
        if (value === "") {
            onSearch?.(value);
            return;
        }

        // Set new debounce timer
        debounceTimerRef.current = setTimeout(() => {
            onSearch?.(value);
        }, debounceDelay);
    };

    const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            // Clear debounce timer and immediately trigger search on Enter
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            onSearch?.(searchTerm);
        }
    };

    return (
        <div className={ cn("relative w-full md:w-72", className) }>
            <Input
                type="search"
                placeholder={ placeholder || "Search here..." }
                value={ searchTerm }
                onChange={ (event) => handleSearchTerm(event.target.value) }
                onKeyDown={ handleSearch }
                className="pl-8"
                autoFocus={ autoFocus }
            />
            <Search className="text-muted-foreground absolute top-[50%] left-2.5 h-4 w-4 -translate-y-1/2" />
        </div>
    );
};
