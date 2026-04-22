'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { nanoid } from 'nanoid';

export async function createQRCodeAction(formData: FormData) {
  const nome = formData.get('nome') as string;
  const destino_url = formData.get('destino_url') as string;
  const tipo = formData.get('tipo') as string;

  if (!nome || !destino_url || !tipo) {
    return { success: false, error: 'Todos os campos são obrigatórios.' };
  }

  // Validate URL basic format
  try {
    new URL(destino_url);
  } catch (e) {
    return { success: false, error: 'URL de destino inválida.' };
  }

  // Generate 8-character ID
  const id = nanoid(8);

  const { error } = await supabaseAdmin.from('qr_codes').insert({
    id,
    nome,
    destino_url,
    tipo,
  });

  if (error) {
    console.error('Error creating QR Code:', error);
    return { success: false, error: 'Erro ao criar QR Code no banco de dados.' };
  }

  return { success: true, id };
}
