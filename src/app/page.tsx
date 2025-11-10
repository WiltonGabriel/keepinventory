import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona para a página de login, que é o ponto de entrada da aplicação.
  redirect('/login');
}
