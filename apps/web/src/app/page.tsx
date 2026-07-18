import { ReadingSurface } from "@/components/shared/reading-surface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const designPrinciples = [
  "Quiet chrome around immersive reading",
  "Semantic tokens before page-specific styling",
  "Reader typography separated from application UI",
  "Accessible primitives for every interaction",
] as const;

export default function Home() {
  return (
    <ReadingSurface>
      <Card className="shadow-soft">
        <CardHeader>
          <p className="font-sans text-sm font-medium text-muted-foreground">
            Design foundation
          </p>
          <CardTitle className="max-w-3xl font-reading text-4xl leading-tight">
            A premium reading surface with durable application chrome.
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="reading-prose max-w-readable">
            Future pages inherit the same navigation, providers, typography,
            theme contract, focus behavior, and semantic color system.
          </p>
          <Separator />
          <ul className="grid gap-3 font-sans text-sm text-muted-foreground sm:grid-cols-2">
            {designPrinciples.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </ReadingSurface>
  );
}
