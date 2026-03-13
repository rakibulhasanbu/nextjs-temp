"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface CustomOTPFormInputProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    description?: string;
    placeholder?: string;
    length?: number;
    pattern?: string;
}

export const CustomOTPFormInput = <T extends FieldValues> ({
    control,
    name,
    label,
    description,
    placeholder,
    length = 4,
    pattern,
}: CustomOTPFormInputProps<T>) => {
    return (
        <FormField
            control={ control }
            name={ name }
            render={ ({ field }) => (
                <FormItem className="center flex-col">
                    <FormLabel>{ label }</FormLabel>
                    <FormControl>
                        <InputOTP maxLength={ length } { ...field } placeholder={ placeholder } pattern={ pattern }>
                            <InputOTPGroup>
                                { Array.from({ length }, (_, index) => (
                                    <InputOTPSlot key={ index } index={ index } />
                                )) }
                            </InputOTPGroup>
                        </InputOTP>
                    </FormControl>
                    <FormDescription>{ description }</FormDescription>
                    <FormMessage />
                </FormItem>
            ) }
        />
    );
};
