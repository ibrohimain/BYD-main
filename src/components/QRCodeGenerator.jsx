import { useEffect, useRef } from 'react';
import QRCodeLib from 'qrcode';

export default function QRCodeGenerator({ value, size = 200 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    QRCodeLib.toCanvas(canvasRef.current, value, { width: size }, (error) => {
      if (error) console.error(error);
    });
  }, [value, size]);

  return <canvas ref={canvasRef} className="mx-auto" />;
}