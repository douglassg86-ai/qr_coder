import Link from 'next/link';
import { QrCode, LayoutDashboard, PlusCircle, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <QrCode className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block">QR Tracker</span>
        </div>
        <nav className="flex-1 flex gap-6 md:gap-10 pl-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard/novo"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Novo QR Code</span>
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <form action="/login/logout" method="POST">
             <button type="submit" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
               <LogOut className="h-4 w-4" />
               <span className="hidden sm:inline-block">Sair</span>
             </button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
