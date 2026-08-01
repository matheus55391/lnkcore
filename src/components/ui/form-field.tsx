import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/** Consistent vertical spacing between label, control, and helper/error text. */
export function FormField({ children, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 [&>label]:mb-0",
        className
      )}
    >
      {children}
    </div>
  );
}
