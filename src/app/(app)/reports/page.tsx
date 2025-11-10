
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
      <Card className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <BarChart3 className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-2xl font-bold tracking-tight">
            Página de Relatórios
          </h3>
          <p className="text-sm text-muted-foreground">
            Esta seção está em desenvolvimento. Em breve, você poderá visualizar gráficos e relatórios detalhados do seu inventário.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
