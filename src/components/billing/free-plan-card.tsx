import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plan } from "@/@types";
import { SubscribeButton } from "@/components/billing/subscribe-button";

export function FreePlanCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Plano atual
          <Badge variant="secondary">{Plan.FREE}</Badge>
        </CardTitle>
        <CardDescription>
          Faça upgrade para o plano PRO e desbloqueie todos os recursos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SubscribeButton />
      </CardContent>
    </Card>
  );
}
