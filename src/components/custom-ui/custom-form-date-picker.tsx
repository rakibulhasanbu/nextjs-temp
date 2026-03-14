"use client";

import * as React from "react";

import { CalendarIcon } from "lucide-react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type TCustomFormDatePicker<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    placeholder?: string;
    description?: string;
    disabled?: boolean;
    required?: boolean;
    showAsterisk?: boolean;
    disablePastDates?: boolean;
    disableFutureDates?: boolean;
    fromDate?: Date;
    toDate?: Date;
};

export const CustomFormDatePicker = <T extends FieldValues> ({
    name,
    control,
    label,
    placeholder = "Pick a date",
    description,
    disabled,
    required,
    showAsterisk = true,
    disablePastDates = false,
    disableFutureDates = false,
    fromDate,
    toDate,
}: TCustomFormDatePicker<T>) => {
    return (
        <Controller
            name={ name }
            control={ control }
            disabled={ disabled }
            render={ ({ field, fieldState }) => (
                <Field data-invalid={ fieldState.invalid }>
                    { label && (
                        <FieldLabel htmlFor={ name }>
                            { label } { showAsterisk ? required && <span className="text-red-500">*</span> : null }
                        </FieldLabel>
                    ) }
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                aria-invalid={ fieldState.invalid }
                                className={ cn(
                                    "w-full justify-start text-left font-normal h-auto min-h-[38px]",
                                    !field.value && "text-muted-foreground",
                                    fieldState.invalid && "border-destructive"
                                ) }
                                disabled={ disabled }
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                { field.value ? (
                                    new Date(field.value).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })
                                ) : (
                                    <span>{ placeholder }</span>
                                ) }
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={ field.value }
                                onSelect={ field.onChange }
                                disabled={ (date) => {
                                    if (disabled) return true;
                                    if (disablePastDates && date < new Date(new Date().setHours(0, 0, 0, 0))) {
                                        return true;
                                    }
                                    if (disableFutureDates && date > new Date(new Date().setHours(23, 59, 59, 999))) {
                                        return true;
                                    }
                                    if (fromDate && date < fromDate) {
                                        return true;
                                    }
                                    if (toDate && date > toDate) {
                                        return true;
                                    }
                                    return false;
                                } }
                            />
                        </PopoverContent>
                    </Popover>
                    { description && <FieldDescription>{ description }</FieldDescription> }
                    { fieldState.invalid && (
                        <FieldError errors={ [ fieldState.error ] } />
                    ) }
                </Field>
            ) }
        />
    );
};
