import QRCode from 'qrcode';

export interface QrisCardOptions {
  merchantName: string;
  nmid: string;
  nominal?: number;
  qrPayload?: string;
}

/**
 * Generates an official Indonesian QRIS standee card as a high-resolution crisp PNG Data URL.
 * Designed with standard ASPI/Bank Indonesia layout:
 * - Red QRIS banner with white typography
 * - GPN logo indicator
 * - Bold Merchant Name and NMID
 * - High-density, high-contrast, razor-sharp QR matrix
 * - Supported banking/e-wallet logos footer
 */
export async function generateDefaultQrisDataUrl(options?: Partial<QrisCardOptions>): Promise<string> {
  const merchantName = options?.merchantName || 'KOPERASI EL-BAYAN';
  const nmid = options?.nmid || 'ID1020260210001';
  const qrString =
    options?.qrPayload ||
    `00020101021226650014ID.LINKAJA.WWW01189360091800000000000215ID10202602100010303UME51440014ID.CO.QRIS.WWW0215ID10202602100010303UME5204549953033605802ID5917KOPERASI EL-BAYAN6007CILACAP61055326462070703A016304${options?.nominal ? `5406${options.nominal}` : ''}6304`;

  // 1. Generate crisp QR code canvas
  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, qrString, {
    width: 600,
    margin: 1,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });

  // 2. Composite into standard official QRIS layout on a high-res canvas (800 x 1100 px)
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return qrCanvas.toDataURL('image/png');

  // Background White
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top Red QRIS Header
  ctx.fillStyle = '#C5221F';
  ctx.fillRect(0, 0, canvas.width, 140);

  // QRIS Logo Text (stylized)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 64px "Inter", "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('QRIS', 48, 88);

  ctx.font = '700 16px "Inter", Arial, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('PEMBAYARAN DIGITAL INDONESIA', 48, 116);

  // GPN / National Payment Badge
  ctx.beginPath();
  ctx.arc(720, 68, 38, 0, Math.PI * 2);
  ctx.fillStyle = '#B01D1A';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 20px "Inter", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GPN', 720, 75);

  // Merchant Header Section
  ctx.fillStyle = '#0F172A';
  ctx.font = '800 32px "Inter", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(merchantName.toUpperCase(), canvas.width / 2, 205);

  ctx.fillStyle = '#64748B';
  ctx.font = '600 20px "Courier New", monospace';
  ctx.fillText(`NMID : ${nmid}`, canvas.width / 2, 240);

  // Subtitle / Standard Notice
  ctx.fillStyle = '#10B981';
  ctx.font = '700 16px "Inter", Arial, sans-serif';
  ctx.fillText('SATU QRIS UNTUK SEMUA APLIKASI PEMBAYARAN', canvas.width / 2, 275);

  // Draw QR Frame
  const qrX = 100;
  const qrY = 300;
  const qrSize = 600;

  ctx.fillStyle = '#F8FAFC';
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 20);
  ctx.fill();
  ctx.stroke();

  // Draw QR Image
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  // Bottom Notice & Supported Apps Banner
  ctx.fillStyle = '#0F172A';
  ctx.font = '700 18px "Inter", Arial, sans-serif';
  ctx.fillText('Scan dengan Mobile Banking atau e-Wallet Apapun', canvas.width / 2, 970);

  ctx.fillStyle = '#64748B';
  ctx.font = '500 14px "Inter", Arial, sans-serif';
  ctx.fillText('BSI • BCA • BRI • MANDIRI • BNI • GOPAY • OVO • DANA • SHOPEEPAY • LINKAJA', canvas.width / 2, 1005);

  // Border frame for the entire card
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

  return canvas.toDataURL('image/png', 1.0);
}

/**
 * Optimizes an uploaded QRIS image file specifically for high legibility:
 * Keeps sharpness and uses PNG or quality 0.94 JPEG so scanner cameras
 * can detect fine QR matrix modules without blur.
 */
export function compressQrisImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1600,
  quality = 0.94
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Fill white background in case image is transparent PNG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Prefer PNG for razor-sharp QR codes if size is acceptable, otherwise high quality JPEG
        const pngUrl = canvas.toDataURL('image/png');
        if (pngUrl.length < 900_000) {
          // Under 900KB fits safely in Firestore document (1MB limit)
          resolve(pngUrl);
        } else {
          resolve(canvas.toDataURL('image/jpeg', quality));
        }
      };
      img.onerror = () => {
        resolve(event.target?.result as string);
      };
    };
    reader.onerror = (err) => reject(err);
  });
}
