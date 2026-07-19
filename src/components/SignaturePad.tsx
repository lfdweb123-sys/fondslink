'use client';
import { useRef, useEffect, useState } from 'react';

interface Props {
  onSign: (dataUrl: string) => void;
}

export default function SignaturePad({ onSign }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
  }, []);

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) onSign(canvas.toDataURL());
  };

  return (
    <div className="border border-gray-300 rounded-lg bg-white touch-none">
      <canvas
        ref={canvasRef}
        width={500}
        height={200}
        className="w-full h-[200px]"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
      <p className="text-xs text-gray-500 mt-2 text-center">Signez dans l'espace ci-dessus</p>
    </div>
  );
}