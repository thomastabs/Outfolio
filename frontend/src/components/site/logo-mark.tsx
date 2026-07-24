import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid size-7 place-items-center rounded-md bg-ink">
        <span className="size-2.5 rotate-45 border-[1.5px] border-canvas" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-ink">Outfolio</span>
    </span>
  );
}