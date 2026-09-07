import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Smartphone, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';
import { ProjectData } from '../types';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: ProjectData;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  projectData,
}) => {
  // Determine canonical shared URL or fallback to window.location.href
  const defaultSharedUrl = typeof window !== 'undefined'
    ? (window.location.hostname.includes('ais-dev') 
        ? window.location.href.replace('ais-dev', 'ais-pre') 
        : window.location.href)
    : 'https://ais-pre-k7fccz2e73af6c5tsmf7jy-429892438897.asia-southeast1.run.app';

  const [qrUrl, setQrUrl] = useState<string>(defaultSharedUrl);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR Code on URL change or modal open
  useEffect(() => {
    if (!isOpen) return;
    
    // Ensure we pick up current URL if not yet set
    const targetUrl = qrUrl || (typeof window !== 'undefined' ? window.location.href : defaultSharedUrl);
    
    setIsGenerating(true);
    QRCode.toDataURL(targetUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: '#0f172a', // deep slate
        light: '#ffffff', // pure white for highest optical scan contrast
      },
      errorCorrectionLevel: 'H', // High error correction so logo or minor prints don't affect scan
    })
      .then((url) => {
        setQrDataUrl(url);
        setIsGenerating(false);
      })
      .catch((err) => {
        console.error('Failed to generate QR code:', err);
        setIsGenerating(false);
      });
  }, [isOpen, qrUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `BOTNIX-Borewell-Rescue-Robot-QRCode.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrintPlacard = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>BOTNIX - Competition Showcase QR Placard</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 1.5cm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              text-align: center;
              padding: 20px;
              margin: 0;
            }
            .card {
              border: 3px solid #ea580c;
              border-radius: 24px;
              padding: 40px 30px;
              max-width: 650px;
              margin: 0 auto;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            }
            .badge {
              display: inline-block;
              background: #fff7ed;
              color: #c2410c;
              border: 1px solid #fdba74;
              font-weight: 700;
              font-size: 13px;
              padding: 6px 16px;
              border-radius: 50px;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 12px;
            }
            h1 {
              font-size: 32px;
              margin: 0 0 8px 0;
              font-weight: 900;
              color: #0f172a;
              letter-spacing: -0.5px;
            }
            .motto {
              font-size: 15px;
              font-weight: 800;
              color: #ea580c;
              letter-spacing: 2px;
              margin-bottom: 14px;
            }
            .subtitle {
              font-size: 14px;
              color: #475569;
              max-width: 500px;
              margin: 0 auto 28px auto;
              line-height: 1.5;
            }
            .qr-frame {
              display: inline-block;
              padding: 16px;
              background: #ffffff;
              border: 2px dashed #cbd5e1;
              border-radius: 20px;
              margin-bottom: 24px;
            }
            .qr-image {
              width: 260px;
              height: 260px;
              display: block;
            }
            .instruction {
              font-size: 16px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 6px;
            }
            .sub-instruction {
              font-size: 13px;
              color: #64748b;
              margin-bottom: 20px;
            }
            .url-box {
              background: #f1f5f9;
              padding: 8px 16px;
              border-radius: 8px;
              font-family: monospace;
              font-size: 11px;
              color: #334155;
              word-break: break-all;
              max-width: 450px;
              margin: 0 auto;
            }
            .footer {
              margin-top: 24px;
              font-size: 12px;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
              padding-top: 14px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">International Robotics Championship • Malaysia 2026</div>
            <h1>BOTNIX</h1>
            <div class="motto">RESCUE. REACH. SAVE.</div>
            <div class="subtitle">Borewell Rescue Robot — Dual-Unit System with Chest Grab Claw, Foldable Base Support & RS-485 Long-Distance Ethernet Tether</div>

            <div class="qr-frame">
              <img src="${qrDataUrl}" class="qr-image" alt="BOTNIX QR Code" />
            </div>

            <div class="instruction">📷 Scan with Smartphone Camera</div>
            <div class="sub-instruction">Instant access to live robot telemetry, claw mechanics, RS-485 specs & competition report (No app installation or login needed)</div>

            <div class="url-box">${qrUrl}</div>

            <div class="footer">
              Team BOTNIX • Representing Bangladesh in Kuala Lumpur, Malaysia 2026
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Instant Showcase QR Code</span>
                <span className="text-[10px] font-mono font-semibold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Direct Scan
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Anyone scanning this QR code immediately opens this full website.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Main Scannable QR Code Canvas */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative p-4 bg-white rounded-2xl shadow-xl border-4 border-orange-500/30 transition-transform hover:scale-[1.02] duration-300">
              {isGenerating ? (
                <div className="w-64 h-64 flex flex-col items-center justify-center text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-orange-500 mb-2" />
                  <span className="text-xs font-medium">Generating QR Code...</span>
                </div>
              ) : qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="BOTNIX Showcase QR Code"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center text-slate-400 text-xs">
                  Failed to load QR code
                </div>
              )}

              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                Scan with Phone Camera
              </div>
            </div>

            <p className="mt-6 text-xs text-slate-300 max-w-sm leading-relaxed">
              Judges, spectators, or evaluators can point their phone camera at this code. It directly opens the complete BOTNIX web showcase with <strong>zero login or app install needed</strong>!
            </p>
          </div>

          {/* Target URL Configuration */}
          <div className="space-y-2 bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                Target Website URL:
              </span>
              <button
                onClick={handleCopyLink}
                className="text-orange-400 hover:text-orange-300 text-[11px] font-medium flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="input-qr-url"
                type="text"
                value={qrUrl}
                onChange={(e) => setQrUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-slate-900 border border-slate-700/80 text-white font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500"
              />
              <a
                href={qrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
                title="Open in new tab to test"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[10px] text-slate-500">
              This link is live and shareable for your competition in Malaysia.
            </p>
          </div>

          {/* Quick Explanation for the User */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3.5 flex items-start gap-3">
            <Info className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-orange-300">
                Ready for Exhibition & Booth Showcase:
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                You can download the high-res PNG to stick on your robot chassis, poster, or presentation slides. You don't need to edit anything right now — whenever you are ready, all text and photo slots can be updated at any time.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              id="btn-download-qr-image"
              onClick={handleDownloadQR}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download QR Image (PNG)</span>
            </button>

            <button
              id="btn-print-showcase-placard"
              onClick={handlePrintPlacard}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Print Competition Placard</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
