import React from 'react'
import { LogOut, AlertTriangle, X, ShieldAlert } from 'lucide-react'

export default function ConfirmSignOutModal({ isOpen, onClose, onConfirm, isLight }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all relative overflow-hidden ${
        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-slate-400/30' : 'bg-[#090e1a] border-rose-500/30 text-slate-100 shadow-rose-950/50'
      }`}>
        
        {/* Glow Header Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all"
        >
          <X size={16} />
        </button>

        {/* Content */}
        <div className="flex items-start gap-4">
          <div className={`p-3.5 rounded-2xl border shrink-0 ${
            isLight ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            <ShieldAlert size={26} />
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold tracking-tight">Terminate Command Session?</h3>
            <p className={`text-xs mt-1.5 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              You are about to sign out of the KnK Automotive Admin Portal. Any unsaved edits or active chat sessions will be safely preserved.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
              isLight
                ? 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Confirm Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  )
}
