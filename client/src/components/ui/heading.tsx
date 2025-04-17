import { cn } from "@/lib/utils";

interface HeadingProps {
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function Heading({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: HeadingProps) {
  return (
    <div className={cn("mb-10", className)}>
      <h2 className={cn("text-3xl font-bold mb-3 font-playfair text-neutral-900", titleClassName)}>
        {title}
      </h2>
      {description && (
        <p className={cn("text-neutral-600", descriptionClassName)}>
          {description}
        </p>
      )}
    </div>
  );
}
