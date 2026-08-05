import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SiteLayout, SectionHeader } from "@/components/site-layout";
import { Upload, Download, Share2, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/dp")({
  head: () => ({
    meta: [
      { title: "Get Your DP · TEDxOrileIganmu" },
      {
        name: "description",
        content:
          "Create a personalized TEDxOrileIganmu display picture, tag @tedxorileiganmu, and help spread the word about Beyond Boundaries — 6 March 2027, Surulere, Lagos.",
      },
      { property: "og:title", content: "Get Your DP · TEDxOrileIganmu" },
      { property: "og:description", content: "Make it official. Frame your photo, download, and share the word." },
    ],
  }),
  component: DpPage,
});

const ease = [0.22, 1, 0.36, 1] as const;
const SIZE = 1080;

// Circle-mode constants
const CIRCLE_DIAM = 660;
const CIRCLE_CX = SIZE / 2;
const CIRCLE_CY = 400;

type FrameStyle = "white" | "red";
type PicShape  = "circle" | "square";

const STEPS = [
  { n: "01", title: "Upload your photo", body: "A clear, front-facing shot. Everything stays on your device — nothing is uploaded anywhere." },
  { n: "02", title: "Adjust & personalise", body: "Drag to reposition, slide to zoom. Add your name so people know who's going." },
  { n: "03", title: "Download & post", body: "Save the image, set it as your DP, and tag @tedxorileiganmu — we'll repost the best ones." },
];

// Stable LCG grain so texture doesn't flicker between renders
function drawGrain(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.globalAlpha = 0.022;
  let seed = 0xdeadbeef;
  const rand = () => {
    seed = (Math.imul(seed ^ (seed >>> 16), 0x45d9f3b) >>> 0);
    return (seed ^ (seed >>> 16)) / 4294967296;
  };
  for (let i = 0; i < 6000; i++) {
    const v = Math.floor(rand() * 255);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(rand() * SIZE, rand() * SIZE, 1, 1);
  }
  ctx.restore();
}

function setLS(ctx: CanvasRenderingContext2D, px: number) {
  if ("letterSpacing" in ctx) (ctx as unknown as Record<string, unknown>).letterSpacing = `${px}px`;
}

function fitFont(ctx: CanvasRenderingContext2D, text: string, maxW: number, startPx: number, minPx: number, fontFn: (s: number) => string) {
  let s = startPx;
  ctx.font = fontFn(s);
  while (ctx.measureText(text).width > maxW && s > minPx) { s -= 2; ctx.font = fontFn(s); }
  return s;
}

function DpPage() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef    = useRef<HTMLImageElement | null>(null);
  const dragState   = useRef<{ startX: number; startY: number; offX: number; offY: number } | null>(null);

  const [hasImage, setHasImage]     = useState(false);
  const [zoom, setZoom]             = useState(1);
  const [offset, setOffset]         = useState({ x: 0, y: 0 });
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("white");
  const [shape, setShape]           = useState<PicShape>("square");
  const [name, setName]             = useState("");
  const [fontsReady, setFontsReady] = useState(false);
  const [dragging, setDragging]     = useState(false);
  const [canShare, setCanShare]     = useState(false);

  // Reset position when switching shape so photo re-centers
  useEffect(() => { setZoom(1); setOffset({ x: 0, y: 0 }); }, [shape]);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share && !!navigator.canShare);
    if (typeof document === "undefined" || !("fonts" in document)) { setFontsReady(true); return; }
    Promise.all([
      document.fonts.load("800 40px 'Inter Tight'"),
      document.fonts.load("italic 400 40px 'Cormorant Garamond'"),
    ]).catch(() => {}).finally(() => setFontsReady(true));
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const image     = imageRef.current;
    const isRed     = frameStyle === "red";
    const accent    = isRed ? "#E62B1E" : "#F0F0F0";
    const nameCaps  = name.trim().toUpperCase();
    const halfDiam  = CIRCLE_DIAM / 2;

    ctx.clearRect(0, 0, SIZE, SIZE);

    // ── BASE ──────────────────────────────────────────────────────────────────
    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // ── SQUARE MODE ───────────────────────────────────────────────────────────
    if (shape === "square") {
      if (image) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, SIZE, SIZE);
        ctx.clip();
        const bs = Math.max(SIZE / image.width, SIZE / image.height) * zoom;
        ctx.drawImage(image, SIZE / 2 - (image.width * bs) / 2 + offset.x, SIZE / 2 - (image.height * bs) / 2 + offset.y, image.width * bs, image.height * bs);
        ctx.restore();
      }

      // Bottom gradient
      const bg = ctx.createLinearGradient(0, 340, 0, SIZE);
      bg.addColorStop(0,    "rgba(10,10,10,0)");
      bg.addColorStop(0.38, "rgba(10,10,10,0.68)");
      bg.addColorStop(0.72, "rgba(10,10,10,0.94)");
      bg.addColorStop(1,    "rgba(10,10,10,0.99)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Left vignette (subtle depth)
      const lv = ctx.createLinearGradient(0, 0, 240, 0);
      lv.addColorStop(0, "rgba(10,10,10,0.5)");
      lv.addColorStop(1, "rgba(10,10,10,0)");
      ctx.fillStyle = lv;
      ctx.fillRect(0, 0, SIZE, SIZE);

    // ── CIRCLE MODE ───────────────────────────────────────────────────────────
    } else {
      // Subtle grid texture
      ctx.save();
      ctx.globalAlpha = 0.03;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      for (let i = 0; i <= SIZE; i += 90) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, SIZE); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(SIZE, i); ctx.stroke();
      }
      ctx.restore();

      // Warm accent glow behind circle
      const r = isRed ? [230, 43, 30] : [240, 240, 240];
      const rg = ctx.createRadialGradient(CIRCLE_CX, CIRCLE_CY, 0, CIRCLE_CX, CIRCLE_CY, halfDiam * 1.4);
      rg.addColorStop(0,   `rgba(${r[0]},${r[1]},${r[2]},0.08)`);
      rg.addColorStop(0.5, `rgba(${r[0]},${r[1]},${r[2]},0.02)`);
      rg.addColorStop(1,   "rgba(10,10,10,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Circle photo
      ctx.save();
      ctx.beginPath();
      ctx.arc(CIRCLE_CX, CIRCLE_CY, halfDiam, 0, Math.PI * 2);
      ctx.clip();
      if (image) {
        const bs = Math.max(CIRCLE_DIAM / image.width, CIRCLE_DIAM / image.height) * zoom;
        ctx.drawImage(image, CIRCLE_CX - (image.width * bs) / 2 + offset.x, CIRCLE_CY - (image.height * bs) / 2 + offset.y, image.width * bs, image.height * bs);
      } else {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, SIZE, SIZE);
      }
      ctx.restore();

      // Rings
      ctx.save();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(CIRCLE_CX, CIRCLE_CY, halfDiam + 12, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 0.18;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(CIRCLE_CX, CIRCLE_CY, halfDiam + 32, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    // ── GRAIN ─────────────────────────────────────────────────────────────────
    drawGrain(ctx);

    // ── RED TOP BAR ───────────────────────────────────────────────────────────
    ctx.fillStyle = "#E62B1E";
    ctx.fillRect(0, 0, SIZE, 6);

    // ── CORNER MARKS ─────────────────────────────────────────────────────────
    const CM = 48, CL = 40;
    const markColor = isRed ? "#E62B1E" : "rgba(240,240,240,0.28)";
    ctx.strokeStyle = markColor;
    ctx.lineWidth = 2;
    ctx.lineCap = "butt";
    // TL
    ctx.beginPath(); ctx.moveTo(CM, CM + CL); ctx.lineTo(CM, CM); ctx.lineTo(CM + CL, CM); ctx.stroke();
    // TR
    ctx.beginPath(); ctx.moveTo(SIZE - CM - CL, CM); ctx.lineTo(SIZE - CM, CM); ctx.lineTo(SIZE - CM, CM + CL); ctx.stroke();
    // BL
    ctx.beginPath(); ctx.moveTo(CM, SIZE - CM - CL); ctx.lineTo(CM, SIZE - CM); ctx.lineTo(CM + CL, SIZE - CM); ctx.stroke();
    // BR
    ctx.beginPath(); ctx.moveTo(SIZE - CM - CL, SIZE - CM); ctx.lineTo(SIZE - CM, SIZE - CM); ctx.lineTo(SIZE - CM, SIZE - CM - CL); ctx.stroke();

    // ── TED·x BADGE ──────────────────────────────────────────────────────────
    ctx.save();
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    const bx = CM, by = CM + 26;
    ctx.font = "900 26px 'Inter Tight', system-ui, sans-serif";
    ctx.fillStyle = "#F0F0F0";
    ctx.fillText("TED", bx, by);
    const tw = ctx.measureText("TED").width;
    ctx.fillStyle = "#E62B1E";
    ctx.fillText("x", bx + tw + 1, by);
    ctx.fillStyle = "rgba(240,240,240,0.28)";
    ctx.font = "500 11px 'Inter Tight', system-ui, sans-serif";
    setLS(ctx, 2.5);
    ctx.fillText("ORILEIGANMU", bx, by + 18);
    setLS(ctx, 0);
    ctx.restore();

    // ── TEXT BLOCK (SQUARE) ───────────────────────────────────────────────────
    if (shape === "square") {
      const TX   = CM + 4;
      const maxW = SIZE - CM * 2 - 8;
      let ty = 782;

      ctx.textAlign    = "left";
      ctx.textBaseline = "alphabetic";

      // "IS ATTENDING"
      ctx.fillStyle = "#E62B1E";
      ctx.font = "700 13px 'Inter Tight', system-ui, sans-serif";
      setLS(ctx, 4.5);
      ctx.fillText("IS ATTENDING", TX, ty);
      setLS(ctx, 0);
      ty += 22;

      // Accent rule
      ctx.fillStyle = accent;
      ctx.fillRect(TX, ty, 56, 1.5);
      ty += 26;

      // Name — BIG
      if (nameCaps) {
        const ns = fitFont(ctx, nameCaps, maxW, 90, 32, s => `800 ${s}px 'Inter Tight', system-ui, sans-serif`);
        setLS(ctx, -1.5);
        ctx.fillStyle = "#F0F0F0";
        ctx.fillText(nameCaps, TX, ty + ns * 0.78);
        ty += ns * 0.78 + ns * 0.24 + 16;
        setLS(ctx, 0);
      }

      // TEDxOrileIganmu
      const ts = nameCaps ? 62 : 78;
      ctx.font = `italic 400 ${ts}px 'Cormorant Garamond', Georgia, serif`;
      ctx.fillStyle = "#F0F0F0";
      setLS(ctx, 0);
      ctx.fillText("TEDxOrileIganmu", TX, ty + ts * 0.78);
      ty += ts * 0.78 + ts * 0.26 + 14;

      // Event details
      ctx.fillStyle = "rgba(240,240,240,0.36)";
      ctx.font = "500 13px 'Inter Tight', system-ui, sans-serif";
      setLS(ctx, 3);
      ctx.fillText("BEYOND BOUNDARIES · 6 MARCH 2027 · SURULERE, LAGOS", TX, ty);
      ty += 24;
      setLS(ctx, 0);

      // URL
      ctx.fillStyle = "rgba(240,240,240,0.18)";
      ctx.font = "400 12px 'Inter Tight', system-ui, sans-serif";
      setLS(ctx, 1.5);
      ctx.fillText("tedxorileiganmu.xyz", TX, ty);
      setLS(ctx, 0);

    // ── TEXT BLOCK (CIRCLE) ───────────────────────────────────────────────────
    } else {
      ctx.textAlign    = "center";
      ctx.textBaseline = "alphabetic";
      const CX2  = SIZE / 2;
      let ty     = CIRCLE_CY + halfDiam + 38;

      // Separator line
      ctx.fillStyle = "rgba(240,240,240,0.1)";
      ctx.fillRect(CM + 24, ty, SIZE - (CM + 24) * 2, 1);
      ty += 30;

      // "IS ATTENDING"
      ctx.fillStyle = "#E62B1E";
      ctx.font = "700 12px 'Inter Tight', system-ui, sans-serif";
      setLS(ctx, 4.5);
      ctx.fillText("IS ATTENDING", CX2, ty);
      setLS(ctx, 0);
      ty += 30;

      // Name
      if (nameCaps) {
        const cMaxW = CIRCLE_DIAM * 0.88;
        const ns = fitFont(ctx, nameCaps, cMaxW, 52, 22, s => `800 ${s}px 'Inter Tight', system-ui, sans-serif`);
        setLS(ctx, -0.8);
        ctx.fillStyle = "#F0F0F0";
        ctx.fillText(nameCaps, CX2, ty + ns * 0.78);
        ty += ns * 0.78 + ns * 0.24 + 12;
        setLS(ctx, 0);
      }

      // TEDxOrileIganmu
      const ts = nameCaps ? 60 : 72;
      ctx.font = `italic 400 ${ts}px 'Cormorant Garamond', Georgia, serif`;
      ctx.fillStyle = "#F0F0F0";
      ctx.fillText("TEDxOrileIganmu", CX2, ty + ts * 0.78);
      ty += ts * 0.78 + ts * 0.26 + 14;

      // Event details
      ctx.fillStyle = "rgba(240,240,240,0.32)";
      ctx.font = "500 12px 'Inter Tight', system-ui, sans-serif";
      setLS(ctx, 3);
      ctx.fillText("BEYOND BOUNDARIES · 6 MARCH 2027", CX2, ty);
      ty += 22;
      setLS(ctx, 0);

      // URL
      ctx.fillStyle = "rgba(240,240,240,0.16)";
      ctx.font = "400 11px 'Inter Tight', system-ui, sans-serif";
      setLS(ctx, 1.5);
      ctx.fillText("tedxorileiganmu.xyz", CX2, ty);
      setLS(ctx, 0);
    }
  }, [zoom, offset, frameStyle, shape, name]);

  useEffect(() => { if (fontsReady) draw(); }, [draw, fontsReady, hasImage]);

  const handleFile = useCallback((file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => { imageRef.current = img; setZoom(1); setOffset({ x: 0, y: 0 }); setHasImage(true); };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const clampOffset = useCallback((offX: number, offY: number, z: number) => {
    const image = imageRef.current;
    if (!image) return { x: 0, y: 0 };
    const effSize = shape === "square" ? SIZE : CIRCLE_DIAM;
    const bs  = Math.max(effSize / image.width, effSize / image.height) * z;
    const maxX = Math.max(0, (image.width  * bs - effSize) / 2);
    const maxY = Math.max(0, (image.height * bs - effSize) / 2);
    return { x: Math.min(maxX, Math.max(-maxX, offX)), y: Math.min(maxY, Math.max(-maxY, offY)) };
  }, [shape]);

  const getScale = () => {
    const canvas = canvasRef.current;
    if (!canvas) return 1;
    return SIZE / canvas.getBoundingClientRect().width;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!hasImage) return;
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, offX: offset.x, offY: offset.y };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragState.current) return;
    const f = getScale();
    const dx = (e.clientX - dragState.current.startX) * f;
    const dy = (e.clientY - dragState.current.startY) * f;
    setOffset(clampOffset(dragState.current.offX + dx, dragState.current.offY + dy, zoom));
  };
  const endDrag = () => { dragState.current = null; setDragging(false); };

  const onZoomChange = (z: number) => { setZoom(z); setOffset(prev => clampOffset(prev.x, prev.y, z)); };
  const handleReset = () => { setZoom(1); setOffset({ x: 0, y: 0 }); };

  const fileSlug = () =>
    name.trim()
      ? `tedxorileiganmu-dp-${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}.png`
      : "tedxorileiganmu-dp.png";

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasImage) return;
    const a = document.createElement("a");
    a.download = fileSlug();
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const handleShare = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasImage) return;
    const t = name.trim();
    const text = t
      ? `${t} is attending TEDxOrileIganmu · Beyond Boundaries · 6 March 2027. Join me!`
      : "I'm attending TEDxOrileIganmu · Beyond Boundaries · 6 March 2027. Join me!";
    canvas.toBlob(async blob => {
      if (!blob) return;
      const file = new File([blob], fileSlug(), { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        try { await navigator.share({ files: [file], title: "I'm attending TEDxOrileIganmu", text }); } catch { /* cancelled */ }
      } else { handleDownload(); }
    }, "image/png");
  };

  return (
    <SiteLayout>
      <SectionHeader
        kicker="Spread the Word"
        title={<>Make it <span className="font-serif italic font-normal text-red">official.</span></>}
        lede="Upload your photo, add your name, and download a display picture that lets everyone know you'll be in the room."
      />

      <section className="bg-ink text-white border-t border-white/8">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
          <div className="grid gap-14 lg:grid-cols-[1fr_360px] lg:gap-20 items-start">

            {/* ── CANVAS ─────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
            >
              <div className="mx-auto max-w-[520px]">
                {/* Canvas preview */}
                <div
                  className={`relative aspect-square w-full overflow-hidden bg-[#0A0A0A] select-none ring-1 ring-white/8 ${hasImage ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                >
                  <canvas
                    ref={canvasRef}
                    width={SIZE}
                    height={SIZE}
                    className="block w-full h-full touch-none"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={endDrag}
                    onPointerLeave={endDrag}
                    onPointerCancel={endDrag}
                  />
                  {!hasImage && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-white/50 hover:text-white/80 transition-colors"
                      style={{ paddingBottom: shape === "circle" ? "36%" : "30%" }}
                    >
                      <div className="w-16 h-16 border border-white/15 flex items-center justify-center">
                        <Upload size={22} strokeWidth={1.25} />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.28em]">Click or drop to upload</span>
                    </button>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />

                {/* Controls */}
                <div className="mt-8 flex flex-col gap-6">
                  {/* Name input */}
                  <div>
                    <label htmlFor="dp-name" className="block text-[9px] uppercase tracking-[0.25em] text-white/30 mb-2.5">
                      Your name <span className="text-white/15 normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      id="dp-name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      maxLength={36}
                      placeholder="e.g. Ada Eze"
                      className="w-full bg-transparent border-b border-white/18 py-2.5 text-sm text-white placeholder-white/22 focus:outline-none focus:border-red transition-colors"
                    />
                  </div>

                  {/* Zoom */}
                  {hasImage && (
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 shrink-0">Zoom</span>
                      <input
                        type="range"
                        min={1} max={2.5} step={0.01}
                        value={zoom}
                        onChange={e => onZoomChange(Number(e.target.value))}
                        className="w-full accent-red"
                      />
                    </div>
                  )}

                  {/* Shape + Style toggles */}
                  <div className="flex flex-wrap gap-x-8 gap-y-4 items-center text-[9px] uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                      <span className="text-white/28 mr-0.5">Format</span>
                      {(["square", "circle"] as PicShape[]).map(s => (
                        <button key={s} onClick={() => setShape(s)}
                          className={`px-4 py-2 border transition-colors ${shape === s ? "border-red bg-red text-white" : "border-white/14 text-white/45 hover:border-white/36 hover:text-white"}`}>
                          {s === "square" ? "Feed" : "Profile"}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/28 mr-0.5">Accent</span>
                      {(["white", "red"] as FrameStyle[]).map(fs => (
                        <button key={fs} onClick={() => setFrameStyle(fs)}
                          className={`px-4 py-2 border transition-colors ${frameStyle === fs ? "border-red bg-red text-white" : "border-white/14 text-white/45 hover:border-white/36 hover:text-white"}`}>
                          {fs === "white" ? "White" : "Red"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 border border-white/18 text-white px-5 py-3 text-[9px] uppercase tracking-[0.2em] hover:border-white/45 transition-colors"
                    >
                      <Upload size={13} strokeWidth={1.75} />
                      {hasImage ? "Change" : "Upload"}
                    </button>
                    {hasImage && (
                      <button onClick={handleReset} aria-label="Reset"
                        className="inline-flex items-center gap-2 border border-white/18 text-white/60 px-3.5 py-3 hover:border-white/40 hover:text-white transition-colors">
                        <RotateCcw size={13} strokeWidth={1.75} />
                      </button>
                    )}
                    <button
                      onClick={handleDownload}
                      disabled={!hasImage}
                      className="group relative ml-auto inline-flex items-center gap-2 bg-red text-white px-6 py-3 text-[9px] uppercase tracking-[0.2em] overflow-hidden disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                      <span className="relative flex items-center gap-2">
                        <Download size={13} strokeWidth={1.75} />
                        Download
                      </span>
                    </button>
                    {canShare && (
                      <button
                        onClick={handleShare}
                        disabled={!hasImage}
                        className="inline-flex items-center gap-2 border border-white/18 text-white px-5 py-3 text-[9px] uppercase tracking-[0.2em] hover:border-white/45 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Share2 size={13} strokeWidth={1.75} />
                        Share
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-white/22 leading-relaxed">
                    Drag the canvas to reposition. Your photo never leaves your device.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── SIDEBAR ────────────────────────────────────────────── */}
            <div className="flex flex-col gap-12">
              <div>
                <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-white/28 mb-8">
                  <span className="h-px w-5 bg-red shrink-0" />
                  <span>Three steps</span>
                </div>
                <div className="flex flex-col gap-9">
                  {STEPS.map(({ n, title, body }, i) => (
                    <motion.div key={n}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                    >
                      <p className="text-red text-[10px] tracking-[0.15em] font-semibold mb-2">{n}</p>
                      <p className="text-[14px] font-semibold mb-1.5 leading-snug">{title}</p>
                      <p className="text-[12px] text-white/38 leading-relaxed">{body}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/8 pt-8">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/24 mb-5">Tag us after you post</p>
                <p className="text-[12px] text-white/38 leading-relaxed mb-1">@tedxorileiganmu</p>
                <p className="text-[12px] text-white/22 leading-relaxed">#TEDxOrileIganmu · #BeyondBoundaries</p>
              </div>

              <div className="border-t border-white/8 pt-8">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/24 mb-5">Format guide</p>
                <div className="flex flex-col gap-3 text-[12px] text-white/38 leading-relaxed">
                  <p><span className="text-white/60 font-medium">Feed</span> — square post for Instagram, WhatsApp status, Twitter/X. Best if your photo fills the frame.</p>
                  <p><span className="text-white/60 font-medium">Profile</span> — circle crop safe for IG, LinkedIn, WhatsApp profile pictures.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
