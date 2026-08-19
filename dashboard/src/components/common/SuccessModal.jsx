import React, { useEffect } from 'react';
import { CheckCircle2, Sparkles, X, ArrowRight, Layers, ShieldCheck } from 'lucide-react';

export default function SuccessModal({
  isOpen,
  onClose,
  title = "Vehicle Dossier Updated Successfully!",
  message = "Your changes have been saved to the persistent database and automatically synchronized live with the storefront showroom.",
  vehicleTitle,
  primaryActionText = "Return to Vehicle Inventory",
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
  isLight = false,
  autoCloseMs = 3500
}) {
  useEffect(() => {
    if (!isOpen || !autoCloseMs) return;
    const timer = setTimeout(() => {
      if (onPrimaryAction) {
        onPrimaryAction();
      } else if (onClose) {
        onClose();
      }
    }, autoCloseMs);
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseMs, onPrimaryAction, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-md rounded-3xl border p-8 shadow-2xl transition-all overflow-hidden text-center ${
        isLight
          ? 'bg-white border-amber-300/80 text-slate-900 shadow-slate-400/50'
          : 'bg-[#0d0d0d] border-[#c9a84c]/50 text-white shadow-[0_0_60px_rgba(201,168,76,0.25)]'
      }`}>
        {/* Top Metallic Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#c9a84c] to-amber-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full border transition-all cursor-pointer ${
            isLight
              ? 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              : 'border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <X size={16} />
        </button>

        {/* Animated Success Badge Icon */}
        <div className="relative mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-tr from-[#c9a84c]/20 via-emerald-500/20 to-[#c9a84c]/10 border-2 border-[#c9a84c] text-[#c9a84c] flex items-center justify-center shadow-[0_0_35px_rgba(201,168,76,0.35)]">
          <CheckCircle2 size={42} className="text-[#c9a84c] drop-shadow-[0_0_12px_rgba(201,168,76,0.8)]" />
          <Sparkles size={16} className="absolute top-1 right-1 text-amber-300 animate-spin" />
        </div>

        {/* Live Sync Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30 text-[10px] font-black uppercase tracking-widest mb-3">
          <ShieldCheck size={13} /> Live Storefront Sync Active
        </div>

        {/* Header Title */}
        <h2 className={`text-xl font-black uppercase tracking-tight mb-2 ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          {title}
        </h2>

        {/* Vehicle Title Tag if provided */}
        {vehicleTitle && (
          <div className="text-xs font-mono font-bold text-[#c9a84c] mb-3 bg-[#c9a84c]/10 py-1.5 px-3.5 rounded-xl border border-[#c9a84c]/25 inline-block max-w-full truncate">
            {vehicleTitle}
          </div>
        )}

        {/* Description Body */}
        <p className={`text-xs leading-relaxed mb-5 ${
          isLight ? 'text-slate-600' : 'text-neutral-300'
        }`}>
          {message}
        </p>

        {/* Status Bullet Badges */}
        <div className={`grid grid-cols-2 gap-2 p-3 rounded-2xl border text-[11px] font-bold mb-6 ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#141414] border-neutral-800 text-neutral-300'
        }`}>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={13} /> Storefront Updated
          </div>
          <div className="flex items-center gap-1.5 text-[#c9a84c]">
            <Layers size={13} /> Strapi Synced
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onPrimaryAction || onClose}
            className="w-full sm:w-auto flex-1 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#c9a84c] to-amber-600 hover:from-[#d8b556] hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#c9a84c]/20 flex items-center justify-center gap-2"
          >
            <span>{primaryActionText}</span>
            <ArrowRight size={15} />
          </button>
          
          {secondaryActionText && (
            <button
              type="button"
              onClick={onSecondaryAction || onClose}
              className={`w-full sm:w-auto px-4 py-3 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-neutral-800 text-neutral-300 hover:bg-white/5'
              }`}
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
