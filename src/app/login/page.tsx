"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BarChart3, Building } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
             <Building className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">AssetWise Inventory</CardTitle>
          <CardDescription>
            Faça login para gerenciar seu inventário
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="usuario@exemplo.com" defaultValue="admin@assetwise.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" defaultValue="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            Entrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
