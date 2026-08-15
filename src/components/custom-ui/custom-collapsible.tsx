import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
    <Accordion className={cn("w-full rounded-lg border px-4 sm:px-6", className)} defaultValue={[title]}>
      <AccordionItem value={title}>
        <AccordionTrigger
          className={cn(
            "text-base font-medium hover:no-underline md:text-lg lg:text-xl",
            collapsible ? "cursor-pointer" : "cursor-default",
            triggerClassName
          )}
        >
          {title}
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
