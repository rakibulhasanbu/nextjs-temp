"use client";

import React, { useState } from "react";

import {
    CircleCheckBig,
    CircleHelp,
    Loader,
    MessageCircleWarning,
    Trash2,
} from "lucide-react";

import {
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export enum AlertType {
    ERROR = "error",
    SUCCESS = "success",
    WARNING = "warning",
    INFO = "info",
}

export type ButtonOptionsType = {
    variant?: "default" | "destructive" | "outline" | "ghost" | "link";
    text?: string;
    className?: string;
};

export type FireProps = {
    title?: React.ReactNode;
    text?: React.ReactNode;

    type?: AlertType;
    showIcon?: boolean;

    onConfirm: () => Promise<{ error?: string } | void> | void;
    confirmButtonOptions?: ButtonOptionsType;

    showCancelButton?: boolean;
    onCancel?: () => Promise<void> | void;
    cancelButtonOptions?: ButtonOptionsType;
};

type AlertDialogProps = Omit<Required<FireProps>, "title" | "text"> & {
    title?: React.ReactNode;
    text?: React.ReactNode;
    closeDialog: () => void;
};

export const AlertDialogContents = (props: AlertDialogProps) => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    return (
        <AlertDialogContent className="min-w-[380px] max-w-md">
            <AlertDialogHeader>
                { props.showIcon && (
                    <div className="mb-4 flex items-center justify-center">
                        { props.type === AlertType.ERROR ? (
                            <Trash2 size={ 64 } />
                        ) : props.type === AlertType.SUCCESS ? (
                            <CircleCheckBig size={ 64 } />
                        ) : props.type === AlertType.WARNING ? (
                            <MessageCircleWarning
                                size={ 64 }
                                className="text-yellow-500 "
                            />
                        ) : (
                            <CircleHelp size={ 64 } className="text-blue-500" />
                        ) }
                    </div>
                ) }
                <AlertDialogTitle
                    className={ cn(
                        `my-0 text-center text-2xl font-medium ${ props.type === AlertType.ERROR && "text-destructive" }`,
                        props.confirmButtonOptions.className
                    ) }
                >
                    { props.title }
                </AlertDialogTitle>
                { props.text && (
                    <AlertDialogDescription className="mt-2 text-center text-sm text-foreground">
                        { props.text }
                    </AlertDialogDescription>
                ) }
                { error && (
                    <AlertDialogDescription className="mt-2 text-destructive-foreground">
                        { error }
                    </AlertDialogDescription>
                ) }
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-0 gap-4 grid grid-cols-2">
                { props.showCancelButton && (
                    <Button
                        variant={ props.cancelButtonOptions.variant }
                        onClick={ async () => {
                            await props.onCancel();
                            props.closeDialog();
                        } }
                        disabled={ loading }
                        className="w-full"
                    >
                        { props.cancelButtonOptions.text }
                    </Button>
                ) }
                <Button
                    variant={ props.confirmButtonOptions.variant }
                    onClick={ async () => {
                        setLoading(true);
                        const response = await props.onConfirm();
                        setLoading(false);

                        if (response?.error) {
                            setError(response.error);
                            return;
                        }

                        props.closeDialog();
                    } }
                    disabled={ loading }
                    className="w-full"
                >
                    { loading && <Loader className="animate-spin" size={ 20 } /> }
                    { props.confirmButtonOptions.text }
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
};
