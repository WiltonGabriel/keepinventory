
"use client";

import { useState, useEffect } from "react";
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
import { Building, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FirebaseClientProvider, initializeFirebase, useUser } from "@/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  Auth,
} from "firebase/auth";


function LoginPageContent() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [auth, setAuth] = useState<Auth | null>(null);
  const [email, setEmail] = useState("admin@univag.com.br");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // We get the auth instance from the initialized firebase app.
    const { auth: firebaseAuth } = initializeFirebase();
    setAuth(firebaseAuth);
  }, []);

  useEffect(() => {
    // If the user is loaded and exists, redirect to the dashboard.
    if (!isUserLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isUserLoading, router]);


  const handleLogin = async () => {
    if (!auth) return;
    setError(null);
    if (!email || !password) {
      setError("Por favor, preencha o e-mail e a senha corretamente.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useEffect above will handle the redirection.
    } catch (e: any) {
      // If user is not found, try to create a new user.
      if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
           // The useEffect above will handle the redirection.
        } catch (creationError: any) {
          setError(creationError.message);
        }
      } else {
        setError(e.message);
      }
    }
  };

  // While loading or if user is already logged in, show a loader.
  // The redirection will happen in the useEffect.
  if (isUserLoading || user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="loader"></div>
        <style jsx>{`
          .loader {
            border: 4px solid hsl(var(--muted));
            border-top: 4px solid hsl(var(--primary));
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm relative">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Building className="w-12 h-12 text-primary"/>
            </div>
          <CardTitle>KeepInventory</CardTitle>
          <CardDescription>
            Sistema de Gestão Patrimonial (SGP)
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && (
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Erro de Login</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@univag.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
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


// The main component that wraps the content with the Firebase provider.
export default function LoginPage() {
  return (
    <FirebaseClientProvider>
      <LoginPageContent />
    </FirebaseClientProvider>
  );
}
