"use client";

import React, { useState } from "react";

import { AlertType, FireProps } from "@/providers/AlertProvider";
import { CircleCheckBig, CircleHelp, Loader, MessageCircleWarning, Trash2 } from "lucide-react";

import { CustomButton } from "@/components/custom-ui/custom-button";
import { DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type AlertDialogProps = Omit<Required<FireProps>, "title" | "text"> & {
    title?: React.ReactNode;
    text?: React.ReactNode;
    closeDialog: () => void;
};

export const AlertDialogContent = (props: AlertDialogProps) => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    return (
        <DialogContent className="w-md max-w-lg min-w-[380px] space-y-4 p-4 lg:p-6">
            <div>
                { props.showIcon && (
                    <div className="mb-6 flex items-center justify-center">
                        { props.type === AlertType.ERROR ? (
                            <Trash2 size={ 64 } className="text-destructive" />
                        ) : props.type === AlertType.SUCCESS ? (
                            <CircleCheckBig size={ 64 } className="text-green-500" />
                        ) : props.type === AlertType.WARNING ? (
                            <MessageCircleWarning size={ 64 } className="text-yellow-500" />
                        ) : (
                            <CircleHelp size={ 64 } />
                        ) }
                    </div>
                ) }
                <DialogTitle
                    className={ cn(
                        `my-0 mt-4 text-center text-2xl font-medium ${ props.type === AlertType.ERROR && "text-destructive" }`,
                        props.confirmButtonOptions.className
                    ) }
                >
                    { props.title }
                </DialogTitle>
                { props.text && (
                    <DialogDescription className="text-foreground mt-2 text-center text-sm">
                        { props.text }
                    </DialogDescription>
                ) }
                { error && <DialogDescription className="text-destructive-foreground mt-2">{ error }</DialogDescription> }
            </div>
            <DialogFooter className="my-0 gap-4 grid grid-cols-2">
                { props.showCancelButton && (
                    <CustomButton
                        variant={ props.cancelButtonOptions.variant }
                        onClick={ async () => {
                            await props.onCancel();
                            props.closeDialog();
                        } }
                        disabled={ loading }
                        className="cursor-pointer"
                    >
                        { props.cancelButtonOptions.text }
                    </CustomButton>
                ) }
                <CustomButton
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
                    className="cursor-pointer"
                >
                    { loading && <Loader className="animate-spin" size={ 20 } /> }
                    { props.confirmButtonOptions.text }
                </CustomButton>
            </DialogFooter>
        </DialogContent>
    );
};
