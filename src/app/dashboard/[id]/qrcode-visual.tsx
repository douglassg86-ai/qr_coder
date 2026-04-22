'use client';

import { useEffect, useState, useRef } from 'react';
import QRCodeLib from 'qrcode';
import { Button } from '@/components/ui/button';
import { Download, Copy, Check } from 'lucide-react';

export default function QRCodeVisual({ url, id }: { url: string, id: string }) {
  const [dataUrl, setDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCodeLib.toCanvas(canvasRef.current, url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#0f172a', // slate-900
          light: '#ffffff'
        }
      }, (error) => {
        if (error) console.error(error);
        else {
          setDataUrl(canvasRef.current?.toDataURL() || '');
        }
      });
    }
  }, [url]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `qrcode-${id}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white p-2 rounded-xl shadow-sm border">
        <canvas ref={canvasRef} className="rounded-lg max-w-full" />
      </div>
      
      <div className="flex w-full max-w-sm flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-muted px-3 py-2 rounded-md text-sm truncate font-mono">
            {url}
          </div>
          <Button variant="outline" size="icon" onClick={copyLink} title="Copiar link">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <Button onClick={handleDownload} className="w-full gap-2">
          <Download className="h-4 w-4" /> Download PNG
        </Button>
      </div>
    </div>
  );
}
