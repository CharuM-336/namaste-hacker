import { TopNavigation } from "@/components/navigation/top-navigation";
import { APP_NAME } from "@/lib/constants";

export function AppShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <TopNavigation />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-surface/60">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>{APP_NAME}</span>
          <span>Built for thoughtful, adaptive reading.</span>
        </div>
      </footer>
    </div>
  );
}
