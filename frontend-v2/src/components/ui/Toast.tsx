"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

const CONFIG: Record<ToastType, {
  Icon: React.ElementType;
  iconColor: string;
  barColor: string;
  bg: string;
  border: string;
}> = {
  success: {
    Icon: CheckCircle2,
    iconColor: "#4ade80",
    barColor: "#4ade80",
    bg: "rgba(10,20,12,0.97)",
    border: "rgba(74,222,128,0.18)",
  },
  error: {
    Icon: XCircle,
    iconColor: "#f87171",
    barColor: "#f87171",
    bg: "rgba(22,8,8,0.97)",
    border: "rgba(248,113,113,0.18)",
  },
  warning: {
    Icon: AlertTriangle,
    iconColor: "#fbbf24",
    barColor: "#fbbf24",
    bg: "rgba(20,15,4,0.97)",
    border: "rgba(251,191,36,0.18)",
  },
  info: {
    Icon: Info,
    iconColor: "#60a5fa",
    barColor: "#60a5fa",
    bg: "rgba(6,12,22,0.97)",
    border: "rgba(96,165,250,0.18)",
  },
};

const DURATION = 4500;

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { Icon, iconColor, barColor, bg, border } = CONFIG[toast.type];

  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), DURATION);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.92, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, scale: 0.94, filter: "blur(4px)" }}
      transition={{ type: "spring", stiffness: 340, damping: 28, mass: 0.8 }}
      className="relative w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        boxShadow: `0 4px 6px rgba(0,0,0,0.1), 0 16px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)`,
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Left accent strip */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
        style={{ background: `linear-gradient(to bottom, ${iconColor}, ${iconColor}60)` }}
      />

      <div className="flex items-start gap-3.5 px-5 py-4">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.5, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.08 }}
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${iconColor}15`, border: `1px solid ${iconColor}25` }}
        >
          <Icon size={16} style={{ color: iconColor }} />
        </motion.div>

        {/* Text */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-[13px] font-semibold leading-tight" style={{ color: "rgba(255,255,255,0.92)" }}>
            {toast.title}
          </p>
          {toast.message && (
            <p className="mt-1 text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              {toast.message}
            </p>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(toast.id)}
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <X size={12} />
        </button>
      </div>

      {/* Progress drain bar */}
      <div className="px-5 pb-3.5">
        <div className="h-[2px] w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${iconColor}80, ${iconColor})` }}
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: DURATION / 1000, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2.5 items-end pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev.slice(-3), { id, type, title, message }]);
  }, []);

  return { toasts, dismiss, toast };
}
