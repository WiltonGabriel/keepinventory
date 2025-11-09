import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
       <Card className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <Settings className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-2xl font-bold tracking-tight">
            Página de Configurações
          </h3>
          <p className="text-sm text-muted-foreground">
            Esta seção está em desenvolvimento. Em breve, você poderá configurar as opções da aplicação aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
