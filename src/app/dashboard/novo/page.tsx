'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQRCodeAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NovoQRCodePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Select value needs to be appended manually if not named properly within the react component
    // but we can just use the name attr on Select if supported, or we can get it via state if we wanted.
    // However, shadcn Select might not pass FormData natively unless nested with hidden input.
    // To be safe, we extract from event or manage via state. Let's manage 'tipo' via state to be sure.
    // Actually, I'll add a hidden input manually updated by onValueChange. Let's refactor slightly:
  };

  const submitAction = async (formData: FormData) => {
    setLoading(true);
    setError('');
    const result = await createQRCodeAction(formData);
    if (result.success && result.id) {
       router.push(`/dashboard/${result.id}`);
    } else {
       setError(result.error || 'Erro desconhecido');
       setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Criar Novo QR Code</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Link</CardTitle>
          <CardDescription>Preencha os dados para gerar o QR code rastreável.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={submitAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Identificador</Label>
              <Input id="nome" name="nome" placeholder="Ex: Campanha Instagram Maio" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino_url">URL de Destino</Label>
              <Input id="destino_url" name="destino_url" type="url" placeholder="https://seusite.com.br/oferta" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de QR</Label>
              <Select name="tipo" defaultValue="landing">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imovel">Imóvel</SelectItem>
                  <SelectItem value="landing">Landing Page</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar QR Code'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
