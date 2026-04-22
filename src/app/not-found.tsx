import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
      <div className="text-center space-y-4">
        <div className="flex justify-center text-primary">
          <FileQuestion size={64} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">QR Code não encontrado</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          O link que você tentou acessar não existe ou foi removido.
        </p>
        <div className="mt-8">
          <Link href="/" className={buttonVariants()}>Voltar ao Início</Link>
        </div>
      </div>
    </div>
  );
}
