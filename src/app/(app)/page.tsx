
'use client';
import { redirect } from 'next/navigation';

// A página raiz do grupo (app) redireciona para o dashboard.
export default function AppPage() {
    redirect('/dashboard');
}
