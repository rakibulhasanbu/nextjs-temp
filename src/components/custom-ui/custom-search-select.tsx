"use client";

import { useState } from "react";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type OptionType = {
    label: string;
    value: string;
};

type CustomSearchSelectProps = {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    options: OptionType[];
    className?: string;
    disabled?: boolean;
    showSearch?: boolean;
    description?: string;
    error?: string;
};

export const CustomSearchSelect = ({
    label,
    placeholder = "Select an option",
    value,
    onChange,
    options,
    className,
    disabled,
    showSearch = true,
    description,
    error,
}: CustomSearchSelectProps) => {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const filteredOptions = showSearch
        ? options.filter((option) =>
              option.label.toLowerCase().includes(searchValue.toLowerCase())
          )
        : options;

    return (
        <div className={cn("w-full space-y-1", className)}>
            {label && <div className="text-sm font-medium">{label}</div>}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="secondary"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "hover:border-border w-full justify-between border text-sm hover:bg-transparent",
                            error && "border-destructive"
                        )}
                        disabled={disabled}
                    >
                        {value
                            ? options.find((opt) => opt.value === value)?.label
                            : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-(--radix-popover-trigger-width)! p-0"
                    style={{
                        left: "50%",
                        minWidth: "200px",
                    }}
                >
                    <Command shouldFilter={false} className="w-full rounded-sm">
                        {showSearch && (
                            <CommandInput
                                placeholder={`Search ${label || "option"}...`}
                                value={searchValue}
                                onValueChange={setSearchValue}
                            />
                        )}
                        <CommandList>
                            <CommandEmpty>No option found.</CommandEmpty>
                            <CommandGroup>
                                {filteredOptions.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={(currentValue) => {
                                            onChange(currentValue);
                                            setOpen(false);
                                            setSearchValue("");
                                        }}
                                    >
                                        {option.label}
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === option.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {description && (
                <div className="text-muted-foreground text-[0.8rem]">
                    {description}
                </div>
            )}
            {error && (
                <div className="text-destructive text-sm font-medium">
                    {error}
                </div>
            )}
        </div>
    );
};
