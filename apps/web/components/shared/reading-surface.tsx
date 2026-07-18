import { cn } from "@/lib/cn";

export function ReadingSurface({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-readable px-4 py-12 font-reading sm:px-6 lg:py-16",
        className,
      )}
    >
      {children}
    </section>
  );
}
