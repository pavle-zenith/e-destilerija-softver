import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const dugmeStilovi = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      varijanta: {
        primarno: "bg-indigo-600 text-white hover:bg-indigo-700",
        sporedno: "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100",
        opasno: "text-red-600 hover:bg-red-50",
        tiho: "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
      },
      velicina: {
        sd: "h-9 px-4",
        sm: "h-8 px-3 text-xs",
        ikona: "h-8 w-8",
      },
    },
    defaultVariants: { varijanta: "primarno", velicina: "sd" },
  },
);

type DugmeProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof dugmeStilovi>;

export function Dugme({ className, varijanta, velicina, ...props }: DugmeProps) {
  return (
    <button className={cn(dugmeStilovi({ varijanta, velicina }), className)} {...props} />
  );
}

export { dugmeStilovi };
