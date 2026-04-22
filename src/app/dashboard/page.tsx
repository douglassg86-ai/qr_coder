import { supabaseAdmin } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { QrCode, MousePointerClick, Smartphone, Apple } from 'lucide-react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';

export const revalidate = 0; // Disable caching for the dashboard

export default async function DashboardPage() {
  const { data: qrs } = await supabaseAdmin.from('qr_codes').select('*').order('created_at', { ascending: false });
  const { data: acessos } = await supabaseAdmin.from('acessos').select('qr_id, device_type, os');

  const totalQRs = qrs?.length || 0;
  const totalScans = acessos?.length || 0;

  const mobileScans = acessos?.filter(a => a.device_type === 'mobile').length || 0;
  const iosScans = acessos?.filter(a => a.os === 'iOS').length || 0;

  const percentMobile = totalScans > 0 ? Math.round((mobileScans / totalScans) * 100) : 0;
  const percentIOS = totalScans > 0 ? Math.round((iosScans / totalScans) * 100) : 0;

  // Aggregate scans per QR
  const scansByQr: Record<string, number> = {};
  acessos?.forEach(acesso => {
    scansByQr[acesso.qr_id] = (scansByQr[acesso.qr_id] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de QR Codes</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQRs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Scans</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScans}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acessos Mobile</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{percentMobile}%</div>
            <p className="text-xs text-muted-foreground">{mobileScans} scans de {totalScans}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ecossistema iOS</CardTitle>
            <Apple className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{percentIOS}%</div>
            <p className="text-xs text-muted-foreground">{iosScans} scans de {totalScans}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus QR Codes</CardTitle>
        </CardHeader>
        <CardContent>
          {qrs && qrs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Scans</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qrs.map((qr) => (
                  <TableRow key={qr.id} className="cursor-pointer group hover:bg-muted/50">
                    <TableCell className="font-medium">{qr.nome}</TableCell>
                    <TableCell className="capitalize">{qr.tipo}</TableCell>
                    <TableCell>{new Date(qr.created_at).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="text-right">{scansByQr[qr.id] || 0}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/${qr.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        Ver Detalhes
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum QR Code criado ainda.</p>
              <Link href="/dashboard/novo" className={buttonVariants()}>Criar Primeiro QR Code</Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
