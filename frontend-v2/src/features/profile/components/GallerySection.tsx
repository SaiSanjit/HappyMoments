"use client";

import { useRef, useState } from "react";
import { Plus, ImagePlus, ArrowRight, Loader2, GripVertical, X } from "lucide-react";
import { CatalogImage } from "../ProfilePage";
import { supabase } from "@/lib/supabase";

interface Props {
  images: CatalogImage[];
  vendorId: string;
  onChange: (images: CatalogImage[]) => void;
}

export default function GallerySection({ images, vendorId, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragFromRef = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileDragOver, setFileDragOver] = useState(false);

  // ── Drag-to-reorder ─────────────────────────────────────────────────────────
  const onImgDragStart = (idx: number) => {
    dragFromRef.current = idx;
  };

  const onImgDragOver = (e: React.DragEvent, idx: number) => {
    if (dragFromRef.current === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIdx !== idx) setDragOverIdx(idx);
  };

  const onImgDrop = (e: React.DragEvent, toIdx: number) => {
    const fromIdx = dragFromRef.current;
    if (fromIdx === null) return;
    e.preventDefault();
    if (fromIdx !== toIdx) {
      const arr = [...images];
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      onChange(arr);
    }
    dragFromRef.current = null;
    setDragOverIdx(null);
  };

  const onImgDragEnd = () => {
    dragFromRef.current = null;
    setDragOverIdx(null);
  };

  const handleDelete = (imagesIdx: number) => {
    onChange(images.filter((_, i) => i !== imagesIdx));
  };

  // ── File upload ─────────────────────────────────────────────────────────────
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || uploading) return;
    setUploading(true);
    const newImages: CatalogImage[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${vendorId}/catalog/${Date.now()}_${safeName}`;
        const { error } = await supabase.storage
          .from("vendor-images")
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (error) continue;
        const { data: urlData } = supabase.storage
          .from("vendor-images")
          .getPublicUrl(path);
        newImages.push({
          id: crypto.randomUUID(),
          size: file.size,
          title: safeName,
          filename: safeName,
          media_url: urlData.publicUrl,
          created_at: new Date().toISOString(),
          is_highlighted: images.length === 0 && newImages.length === 0,
        });
      }
    } finally {
      setUploading(false);
    }
    if (newImages.length > 0) onChange([...images, ...newImages]);
  };

  // ── Data ────────────────────────────────────────────────────────────────────
  const cover = images[0] ?? null;
  // thumb slots: positions 1–4 in the images array
  const thumbSlots = [images[1], images[2], images[3], images[4]];
  // first undefined slot gets the upload button
  const uploadSlotIdx = thumbSlots.findIndex((t) => !t);

  return (
    <section
      className="rounded-2xl border p-6"
      style={{ background: "var(--bg2)", borderColor: "var(--border3)" }}
    >
      <div className="mb-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
          Gallery
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text3)" }}>
          The first thing couples see. Drag to reorder.
        </p>
      </div>

      {/*
        Flat grid: 3 cols × 2 rows, 240 px tall.
        Cover occupies col-1 / row-1 through row-2 (row-span-2).
        Thumbs occupy cols 2–3, rows 1–2.
      */}
      <div
        className="mt-4 grid grid-cols-3 grid-rows-2 gap-2"
        style={{ height: 240 }}
      >
        {/* ── Cover slot (row-span-2) ── */}
        <div
          draggable={!!cover}
          onDragStart={() => cover && onImgDragStart(0)}
          onDragOver={(e) => cover && onImgDragOver(e, 0)}
          onDrop={(e) => cover && onImgDrop(e, 0)}
          onDragEnd={onImgDragEnd}
          className="row-span-2 relative rounded-xl overflow-hidden group"
          style={{
            background: "var(--border3)",
            cursor: cover ? "grab" : "default",
            outline: dragOverIdx === 0 ? "2px solid var(--gold)" : "none",
            outlineOffset: 2,
            opacity: dragFromRef.current === 0 ? 0.4 : 1,
          }}
        >
          {cover ? (
            <>
              <img
                src={cover.media_url}
                alt="Cover"
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              />
              {/* Cover badge */}
              <span
                className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full z-10"
                style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}
              >
                Cover
              </span>
              {/* Aspect hint */}
              <span
                className="absolute bottom-2 left-2 text-[10px] rounded-md px-1.5 py-0.5 z-10"
                style={{ background: "rgba(0,0,0,0.45)", color: "rgba(255,255,255,0.8)" }}
              >
                hero · 4×5
              </span>
              {/* Controls: drag handle + delete */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="rounded-md p-0.5" style={{ background: "rgba(0,0,0,0.45)" }}>
                  <GripVertical size={13} color="#fff" />
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(0); }}
                  className="rounded-md p-0.5 hover:bg-red-500/80 transition-colors"
                  style={{ background: "rgba(0,0,0,0.45)" }}
                >
                  <X size={13} color="#fff" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1">
              <ImagePlus size={22} style={{ color: "var(--text-muted)" }} />
              <span
                className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(0,0,0,0.25)", color: "rgba(255,255,255,0.6)" }}
              >
                Cover
              </span>
            </div>
          )}
        </div>

        {/* ── 4 thumbnail slots ── */}
        {thumbSlots.map((item, i) => {
          const imagesIdx = i + 1;
          const isOver = dragOverIdx === imagesIdx;
          const isDragging = dragFromRef.current === imagesIdx;
          const isUpload = !item && i === uploadSlotIdx;

          if (item) {
            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => onImgDragStart(imagesIdx)}
                onDragOver={(e) => onImgDragOver(e, imagesIdx)}
                onDrop={(e) => onImgDrop(e, imagesIdx)}
                onDragEnd={onImgDragEnd}
                className="relative rounded-xl overflow-hidden group cursor-grab active:cursor-grabbing"
                style={{
                  background: "var(--border3)",
                  outline: isOver ? "2px solid var(--gold)" : "none",
                  outlineOffset: 2,
                  opacity: isDragging ? 0.4 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                <img
                  src={item.media_url}
                  alt={item.title}
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                />
                <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="rounded-md p-0.5" style={{ background: "rgba(0,0,0,0.45)" }}>
                    <GripVertical size={12} color="#fff" />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(imagesIdx); }}
                    className="rounded-md p-0.5 hover:bg-red-500/80 transition-colors"
                    style={{ background: "rgba(0,0,0,0.45)" }}
                  >
                    <X size={12} color="#fff" />
                  </button>
                </div>
              </div>
            );
          }

          if (isUpload) {
            return (
              <button
                key="upload"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  if (dragFromRef.current !== null) return;
                  e.preventDefault();
                  setFileDragOver(true);
                }}
                onDragLeave={() => setFileDragOver(false)}
                onDrop={(e) => {
                  if (dragFromRef.current !== null) return;
                  e.preventDefault();
                  setFileDragOver(false);
                  handleUpload(e.dataTransfer.files);
                }}
                className="relative flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed transition-colors"
                style={{
                  borderColor: fileDragOver ? "var(--gold)" : "var(--border2)",
                  background: fileDragOver ? "rgba(201,168,76,0.06)" : "transparent",
                }}
              >
                {uploading ? (
                  <Loader2 size={16} className="animate-spin" style={{ color: "var(--gold)" }} />
                ) : (
                  <>
                    <Plus size={16} style={{ color: "var(--text-muted)" }} />
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Upload photo</span>
                    <span className="text-[9px]" style={{ color: "var(--text3)" }}>or drag in</span>
                  </>
                )}
              </button>
            );
          }

          // Empty placeholder
          return (
            <div
              key={`empty-${i}`}
              className="relative rounded-xl flex items-center justify-center"
              style={{ background: "var(--border3)" }}
            >
              <span className="text-[10px]" style={{ color: "var(--text3)" }}>1×1</span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>{images.length} photo{images.length !== 1 ? "s" : ""} in gallery</span>
          <span style={{ color: "var(--border2)" }}>·</span>
          <span>JPG/PNG up to 12MB</span>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ color: "var(--gold)" }}
        >
          Manage all photos <ArrowRight size={12} />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />
    </section>
  );
}
