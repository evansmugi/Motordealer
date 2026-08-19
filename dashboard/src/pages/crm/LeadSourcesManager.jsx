import React, { useState } from 'react'
import { useCRMStore } from '../../context/CRMStore'
import { Sliders, Plus, Check, X, Tag, Layers, Power } from 'lucide-react'
import PredictiveSelect from '../../components/common/PredictiveSelect'

export default function LeadSourcesManager() {
  const sources = useCRMStore(state => state.leadSources)
  const toggleLeadSource = useCRMStore(state => state.toggleLeadSource)
  const addLeadSource = useCRMStore(state => state.addLeadSource)
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', category: 'lead_source' })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!formData.name) return
    addLeadSource(formData)
    setShowAddModal(false)
    setFormData({ name: '', category: 'lead_source' })
  }

  const leadSourceList = sources.filter(s => s.category === 'lead_source')
  const campaignTypeList = sources.filter(s => s.category === 'campaign_type')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-[#c9a84c] font-semibold block">Lead Setup</span>
          <h1 className={`text-3xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Lead Sources &amp; Campaign Channels
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs tracking-wider uppercase hover:bg-[#d9b85c] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Source</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lead Sources Category */}
        <div className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 space-y-4 ${
          isLight
            ? 'bg-gradient-to-br from-blue-50/40 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-blue-300'
            : 'bg-gradient-to-br from-blue-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-blue-500/40'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl border ${
                isLight ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
              }`}>
                <Layers size={18} />
              </div>
              <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Lead Sources</h3>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-lg font-mono font-bold ${
              isLight ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-blue-500/10 text-blue-400'
            }`}>
              {leadSourceList.length} Sources
            </span>
          </div>

          <div className="space-y-2 font-mono">
            {leadSourceList.map(src => (
              <div key={src.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950/60 border-white/5 text-slate-200 hover:border-white/10'
              }`}>
                <div className="flex items-center gap-2.5">
                  <Tag size={14} className={isLight ? 'text-slate-500' : 'text-slate-400'} />
                  <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{src.name}</span>
                </div>
                <button
                  onClick={() => toggleLeadSource(src.id)}
                  className={`px-3 py-1 rounded-lg text-[10px] uppercase font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    src.is_active
                      ? isLight ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : isLight ? 'bg-slate-200 text-slate-600 border border-slate-300' : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  <Power size={12} />
                  <span>{src.is_active ? 'Active' : 'Disabled'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Types Category */}
        <div className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 space-y-4 ${
          isLight
            ? 'bg-gradient-to-br from-purple-50/40 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-purple-300'
            : 'bg-gradient-to-br from-purple-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-purple-500/40'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl border ${
                isLight ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
              }`}>
                <Sliders size={18} />
              </div>
              <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Marketing Channels</h3>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-lg font-mono font-bold ${
              isLight ? 'bg-purple-50 text-purple-800 border border-purple-200' : 'bg-purple-500/10 text-purple-400'
            }`}>
              {campaignTypeList.length} Channels
            </span>
          </div>

          <div className="space-y-2 font-mono">
            {campaignTypeList.map(src => (
              <div key={src.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950/60 border-white/5 text-slate-200 hover:border-white/10'
              }`}>
                <div className="flex items-center gap-2.5">
                  <Tag size={14} className={isLight ? 'text-slate-500' : 'text-slate-400'} />
                  <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{src.name}</span>
                </div>
                <button
                  onClick={() => toggleLeadSource(src.id)}
                  className={`px-3 py-1 rounded-lg text-[10px] uppercase font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    src.is_active
                      ? isLight ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : isLight ? 'bg-slate-200 text-slate-600 border border-slate-300' : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  <Power size={12} />
                  <span>{src.is_active ? 'Active' : 'Disabled'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl relative font-sans ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-white/10 text-slate-100'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 mb-4 ${isLight ? 'border-slate-200' : 'border-[#c9a84c]/20'}`}>
              <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Add Acquisition Channel Node</h3>
              <button onClick={() => setShowAddModal(false)} className={isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4 text-xs font-mono">
              <div>
                <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  Channel Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TikTok Ads"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950 border-white/10 text-slate-200 placeholder:text-slate-500'
                  }`}
                />
              </div>

              <div>
                <PredictiveSelect
                  label="Category Type"
                  options={[
                    { value: 'lead_source', label: 'Lead Source (lead_source)', badge: 'Source' },
                    { value: 'campaign_type', label: 'Campaign Type (campaign_type)', badge: 'Channel' }
                  ]}
                  value={formData.category}
                  onChange={val => setFormData({ ...formData, category: val })}
                  isLight={isLight}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] shadow-lg cursor-pointer"
                >
                  Save Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
