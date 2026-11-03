import { CheckIcon, XIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubscribeButton } from "@/components/billing/subscribe-button";

const PLAN_FEATURES = [
  { label: "Páginas", free: "1 página", pro: "5 páginas" },
  { label: "Links por página", free: "5 links", pro: "20 links" },
] as const;

function FeatureValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <CheckIcon className="h-4 w-4 text-green-500 mx-auto" />
    ) : (
      <XIcon className="h-4 w-4 text-muted-foreground/40 mx-auto" />
    );
  }
  return <span>{value}</span>;
}

export function PlanComparisonCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>O que muda com o PRO?</CardTitle>
        <CardDescription>Por apenas R$&nbsp;7/mês.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-muted-foreground font-medium w-1/2">
                Recurso
              </th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground w-1/4">
                FREE
              </th>
              <th className="px-4 py-3 text-center font-semibold text-primary w-1/4 bg-primary/5">
                PRO
              </th>
            </tr>
          </thead>
          <tbody>
            {PLAN_FEATURES.map((feature) => (
              <tr key={feature.label} className="border-b last:border-0">
                <td className="px-6 py-3 text-muted-foreground">
                  {feature.label}
                </td>
                <td className="px-4 py-3 text-center">
                  <FeatureValue value={feature.free} />
                </td>
                <td className="px-4 py-3 text-center font-medium bg-primary/5">
                  <FeatureValue value={feature.pro} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-5">
          <SubscribeButton />
        </div>
      </CardContent>
    </Card>
  );
}
