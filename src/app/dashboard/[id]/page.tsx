import { supabaseAdmin, QRCode, Acesso } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { notFound } from 'next/navigation';
import QRCodeVisual from './qrcode-visual';
import { DevicePieChart, TimelineChart } from './charts';

export const revalidate = 0;

export default async function QRDetailPage({ params }: { params: { id: string } }) {
  const { data: qr } = await supabaseAdmin.from('qr_codes').select('*').eq('id', params.id).single();
  
  if (!qr) {
    notFound();
  }

  const { data: acessos } = await supabaseAdmin
    .from('acessos')
    .select('*')
    .eq('qr_id', params.id)
    .order('created_at', { ascending: false });

  const totalScans = acessos?.length || 0;

  // Process data for charts
  const deviceCount: Record<string, number> = {};
  const osCount: Record<string, number> = {};
  const timeline: Record<string, number> = {};

  // Initialize timeline with last 30 days
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    timeline[dateStr] = 0;
  }

  acessos?.forEach(a => {
    // Devices
    const device = a.device_type || 'Desconhecido';
    deviceCount[device] = (deviceCount[device] || 0) + 1;

    // OS
    const os = a.os || 'Desconhecido';
    osCount[os] = (osCount[os] || 0) + 1;

    // Timeline
    const dateStr = new Date(a.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    if (timeline[dateStr] !== undefined) {
      timeline[dateStr]++;
    }
  });

  const deviceData = Object.entries(deviceCount).map(([name, value]) => ({ name, value }));
  const osData = Object.entries(osCount).map(([name, value]) => ({ name, value }));
  const timelineData = Object.entries(timeline).map(([date, scans]) => ({ date, scans }));

  const appBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || process.env.APP_BASE_URL || 'http://localhost:3000';
  const qrUrl = `${appBaseUrl}/r/${qr.id}`;

  const last20Acessos = acessos?.slice(0, 20) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{qr.nome}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
              <CardDescription>Escaneie ou copie o link curto.</CardDescription>
            </CardHeader>
            <CardContent>
              <QRCodeVisual url={qrUrl} id={qr.id} />
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destino:</span>
                  <a href={qr.destino_url} target="_blank" rel="noreferrer" className="text-primary truncate max-w-[200px] hover:underline">
                    {qr.destino_url}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="capitalize font-medium">{qr.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de Scans:</span>
                  <span className="font-bold">{totalScans}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acessos (Últimos 30 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <TimelineChart data={timelineData} />
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Dispositivos</CardTitle>
              </CardHeader>
              <CardContent>
                <DevicePieChart data={deviceData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sistemas Operacionais</CardTitle>
              </CardHeader>
              <CardContent>
                <DevicePieChart data={osData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimos Acessos</CardTitle>
          <CardDescription>Visualizando os últimos 20 scans deste QR Code</CardDescription>
        </CardHeader>
        <CardContent>
          {last20Acessos.length > 0 ? (
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Data / Hora</TableHead>
                   <TableHead>Dispositivo</TableHead>
                   <TableHead>OS</TableHead>
                   <TableHead>Browser</TableHead>
                   <TableHead>Origem (Referrer)</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {last20Acessos.map((a) => (
                   <TableRow key={a.id}>
                     <TableCell>{new Date(a.created_at).toLocaleString('pt-BR')}</TableCell>
                     <TableCell className="capitalize">{a.device_type || '-'}</TableCell>
                     <TableCell>{a.os || '-'}</TableCell>
                     <TableCell>{a.browser || '-'}</TableCell>
                     <TableCell className="max-w-[200px] truncate" title={a.referrer || ''}>
                       {a.referrer || 'Direto'}
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">Nenhum acesso registrado ainda.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
