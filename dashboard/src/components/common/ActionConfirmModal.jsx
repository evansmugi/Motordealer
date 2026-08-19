import React from 'react'
import { Check, X, Trash2, AlertCircle } from 'lucide-react'

export default function ActionConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm System Action",
  description = "Are you sure you want to proceed with this operation?",
  actionType = "confirm", // 'confirm' | 'reject' | 'delete' | 'warning'
  confirmText,
  isLight = false
}) {
  if (!isOpen) return null

  const getThemeConfig = () => {
    switch (actionType) {
      case 'confirm':
        return {
          icon: <Check size={24} className="text-emerald-400" />,
          badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          btnBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/30',
          defaultBtnText: 'Confirm Action',
          headerColor: isLight ? 'text-emerald-800' : 'text-emerald-300'
        }
      case 'reject':
        return {
          icon: <X size={24} className="text-amber-400" />,
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          btnBg: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-950/30',
          defaultBtnText: 'Reject Request',
          headerColor: isLight ? 'text-amber-800' : 'text-amber-300'
        }
      case 'delete':
        return {
          icon: <Trash2 size={24} className="text-rose-400" />,
          badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          btnBg: 'bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white shadow-rose-950/40',
          defaultBtnText: 'Delete Permanently',
          headerColor: isLight ? 'text-rose-800' : 'text-rose-300'
        }
      default:
        return {
          icon: <AlertCircle size={24} className="text-[#c9a84c]" />,
          badgeBg: 'bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]',
          btnBg: 'bg-gradient-to-r from-[#c9a84c] to-amber-600 text-slate-950 font-bold hover:brightness-110 shadow-[#c9a84c]/20',
          defaultBtnText: 'Proceed',
          headerColor: isLight ? 'text-slate-900' : 'text-[#c9a84c]'
        }
    }
  }

  const cfg = getThemeConfig()

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
            : 'bg-[#0c1222] border-white/10 text-slate-100 shadow-black/80'
        }`}
      >
        {/* Close X Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg border transition-all cursor-pointer ${
            isLight ? 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50' : 'border-white/10 text-slate-500 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <X size={16} />
        </button>

        {/* Action Icon Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${cfg.badgeBg}`}>
            {cfg.icon}
          </div>
          <div>
            <span className={`text-[9px] font-mono tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Action Confirmation
            </span>
            <h3 className={`text-base font-bold tracking-tight ${cfg.headerColor}`}>{title}</h3>
          </div>
        </div>

        {/* Action Description */}
        <div className={`p-4 rounded-xl border text-xs leading-relaxed mb-6 ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-white/5 text-slate-300'
        }`}>
          {description}
        </div>

        {/* Action Buttons */}
        <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              isLight ? 'border-slate-300 text-slate-600 hover:bg-slate-100' : 'border-white/10 text-slate-400 hover:bg-white/5'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer ${cfg.btnBg}`}
          >
            {confirmText || cfg.defaultBtnText}
          </button>
        </div>
      </div>
    </div>
  )
}
