import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type TCustomCollapsible = {
    title: string;
    content: React.ReactNode;
    className?: string;
    collapsible?: boolean;
    triggerClassName?: string;
};

export const CustomCollapsible = ({
    title,
    content,
    className,
    collapsible = true,
    triggerClassName,
}: TCustomCollapsible) => {
    return (
        <Accordion
            type="single"
            collapsible={ collapsible }
            className={ cn("w-full rounded-lg px-4 sm:px-6 border", className) }
            defaultValue={ title }
        >
            <AccordionItem value={ title }>
                <AccordionTrigger
                    className={ cn(
                        "hover:no-underline text-base md:text-lg lg:text-xl font-medium",
                        collapsible ? "cursor-pointer" : "cursor-default",
                        triggerClassName
                    ) }
                >
                    { title }
                </AccordionTrigger>
                <AccordionContent>{ content }</AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};
