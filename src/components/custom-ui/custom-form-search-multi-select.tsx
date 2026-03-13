"use client";

import * as React from "react";

import { Check, ChevronsUpDown, X } from "lucide-react";
import { Control, FieldValues, Path, PathValue } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type TCustomFormSearchMultiSelect<T extends FieldValues> = {
    name: Path<T>;
    label?: string;
    placeholder?: string;
    className?: string;
    defaultValue?: string[];
    description?: string;
    disabled?: boolean;
    required?: boolean;
    options: {
        value: string;
        label: string;
    }[];
    control: Control<T>;
};

export const CustomFormSearchMultiSelect = <T extends FieldValues> ({
    label,
    name,
    placeholder,
    description,
    options,
    control,
    defaultValue = [],
    disabled,
    required,
    className,
}: TCustomFormSearchMultiSelect<T>) => {
    const [ open, setOpen ] = React.useState(false);
    const [ searchValue, setSearchValue ] = React.useState("");

    return (
        <FormField
            control={ control }
            name={ name }
            rules={ {
                required: required ? `${ label || name } is required` : false,
            } }
            defaultValue={ defaultValue as PathValue<T, Path<T>> }
            render={ ({ field, fieldState: { error } }) => {
                const selectedValues = (field.value as string[]) || [];
                const selectedOptions = options.filter((option) =>
                    selectedValues.includes(option.value)
                );

                return (
                    <FormItem className={ cn("flex h-fit flex-col", className) }>
                        { label && (
                            <FormLabel>
                                { label }{ " " }
                                { required && (
                                    <span className="text-red-500">*</span>
                                ) }
                            </FormLabel>
                        ) }
                        <FormControl>
                            <Popover open={ open } onOpenChange={ setOpen }>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        role="combobox"
                                        aria-expanded={ open }
                                        className={ cn(
                                            "w-full justify-between border shadow-none text-sm bg-transparent hover:bg-transparent min-h-[40px] h-auto",
                                            {
                                                "border-destructive": error,
                                            }
                                        ) }
                                        disabled={ disabled }
                                    >
                                        <div className="flex flex-wrap gap-1 flex-1 justify-start items-center">
                                            { selectedOptions.length > 0 ? (
                                                selectedOptions.map(
                                                    (option) => (
                                                        <span
                                                            key={ option.value }
                                                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-secondary rounded-md"
                                                        >
                                                            { option.label }
                                                            <button
                                                                type="button"
                                                                onClick={ (
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    const newValues =
                                                                        selectedValues.filter(
                                                                            (
                                                                                v
                                                                            ) =>
                                                                                v !==
                                                                                option.value
                                                                        );
                                                                    field.onChange(
                                                                        newValues
                                                                    );
                                                                } }
                                                                className="ml-1  cursor-pointer hover:text-destructive rounded-full p-0.5"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    { placeholder ||
                                                        "Select options" }
                                                </span>
                                            ) }
                                        </div>
                                        <ChevronsUpDown className="opacity-50 ml-2" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-(--radix-popover-trigger-width)! p-0"
                                    style={ {
                                        left: "50%",
                                        minWidth: "200px",
                                    } }
                                >
                                    <Command
                                        shouldFilter={ false }
                                        className="w-full rounded-sm"
                                    >
                                        <CommandInput
                                            placeholder={ `Search ${ label || "options" }...` }
                                            value={ searchValue }
                                            onValueChange={ setSearchValue }
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                No option found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                { options
                                                    .filter((option) =>
                                                        option.label
                                                            .toLowerCase()
                                                            .includes(
                                                                searchValue.toLowerCase()
                                                            )
                                                    )
                                                    .map((option) => {
                                                        const isSelected =
                                                            selectedValues.includes(
                                                                option.value
                                                            );
                                                        return (
                                                            <CommandItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                                onSelect={ () => {
                                                                    let newValues: string[];
                                                                    if (
                                                                        isSelected
                                                                    ) {
                                                                        newValues =
                                                                            selectedValues.filter(
                                                                                (
                                                                                    v
                                                                                ) =>
                                                                                    v !==
                                                                                    option.value
                                                                            );
                                                                    } else {
                                                                        newValues =
                                                                            [
                                                                                ...selectedValues,
                                                                                option.value,
                                                                            ];
                                                                    }
                                                                    field.onChange(
                                                                        newValues as PathValue<
                                                                            T,
                                                                            Path<T>
                                                                        >
                                                                    );
                                                                } }
                                                            >
                                                                { option.label }
                                                                <Check
                                                                    className={ cn(
                                                                        "ml-auto",
                                                                        isSelected
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    ) }
                                                                />
                                                            </CommandItem>
                                                        );
                                                    }) }
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </FormControl>
                        { description && (
                            <FormDescription>{ description }</FormDescription>
                        ) }
                        { error && <FormMessage>{ error.message }</FormMessage> }
                    </FormItem>
                );
            } }
        />
    );
};
