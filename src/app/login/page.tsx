
import { redirect } from 'next/navigation';

export default function LoginPage() {
  // A autenticação foi removida. Redireciona para o dashboard.
  redirect('/dashboard');
}
