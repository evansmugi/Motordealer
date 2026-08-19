import React, { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/superbaseClient.js'
import { useCRMStore } from '../../context/CRMStore.js'
import {
  Plus, Pencil, Trash2, X, Upload, AlertTriangle,
  Loader2, ChevronDown, ChevronUp, Save, RefreshCw,
  Armchair, Shield, Lightbulb, Wrench, Smartphone, Package, Car,
} from 'lucide-react'

const ACC_TABLE  = 'accessories'
const ACC_BUCKET = 'accessory-images'   // ← change if your bucket is named differently

const CATEGORIES = [
  'Interior', 'Exterior', 'Security', 'Lighting', 'Tools', 'Gadgets', 'Other',
]

const CATEGORY_ICONS = {
  Interior: Armchair, Security: Shield, Lighting: Lightbulb,
  Tools: Wrench, Gadgets: Smartphone, Exterior: Package, default: Car,
}

const EMPTY_FORM = {
  name: '', category: CATEGORIES[0], price: '', badge: '',
  _imageFile: null, _imagePreview: '', _existingImage: null,
}

// ── Tiny shared UI atoms (same style as BlogManager) ─────────────────────────

function FieldLabel({ children }) {
  return (
    <p style={{
      fontFamily: "'Inter', sans-serif", fontSize: 11,
      letterSpacing: 1.5, textTransform: 'uppercase',
      color: 'inherit', fontWeight: 700, marginBottom: 6,
    }}>
      {children}
    </p>
  )
}

function LuxInput({ value, onChange, placeholder, type = 'text', disabled }) {
  return (
    <input
      type={type} value={value} onChange={onChange}
      placeholder={placeholder} disabled={disabled}
      style={{
        width: '100%', background: '#0a0a0a',
        border: '1px solid #1f1f1f', color: '#d1d5db',
        padding: '10px 14px', fontSize: 13, outline: 'none',
        fontFamily: "'Montserrat',sans-serif", boxSizing: 'border-box',
        opacity: disabled ? 0.5 : 1,
      }}
    />
  )
}

function LuxSelect({ value, onChange, options }) {
  return (
    <select value={value} onChange={onChange} style={{
      width: '100%', background: '#0a0a0a',
      border: '1px solid #1f1f1f', color: '#d1d5db',
      padding: '10px 14px', fontSize: 13, outline: 'none',
      fontFamily: "'Montserrat',sans-serif", boxSizing: 'border-box',
      appearance: 'none', cursor: 'pointer',
    }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

// ── Accessory form (create + edit) ────────────────────────────────────────────
function AccessoryForm({ initial, onSaved, onCancel, showToast }) {
  const [form,     setForm]     = useState(initial ?? { ...EMPTY_FORM })
  const [saving,   setSaving]   = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const isEdit = !!initial
  const set    = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    set('_imageFile', file)
    set('_imagePreview', URL.createObjectURL(file))
  }

  // ── Upload image → Supabase Storage, return { url, path } ────────────────
  const uploadImage = async (file, recordId) => {
    const ext  = file.name.split('.').pop()
    const path = `${recordId}-${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from(ACC_BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type })
    if (error) throw error
    const { data } = supabase.storage.from(ACC_BUCKET).getPublicUrl(path)
    return { url: data.publicUrl, path }
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (saving) return
    if (!form.name.trim())  return showToast('error', 'Name is required.')
    if (!form.price)        return showToast('error', 'Price is required.')
    if (!form._imageFile && !form._existingImage)
      return showToast('error', 'Please upload an image.')

    setSaving(true)
    try {
      // Build payload without image first so we have an id for the path
      const basePayload = {
        name:     form.name.trim(),
        category: form.category,
        price:    Number(form.price),
        badge:    form.badge.trim() || null,
      }

      // For new records, insert first to get the auto id
      let recordId = form.id
      if (!isEdit) {
        const { data: inserted, error: insErr } = await supabase
          .from(ACC_TABLE)
          .insert(basePayload)
          .select('id')
          .single()
        if (insErr) throw insErr
        recordId = inserted.id
      }

      // Upload new image if selected
      let imageJson = form._existingImage  // keep existing if no new file
      if (form._imageFile) {
        // Delete old image from storage if editing
        if (isEdit && form._existingImage?.path) {
          await supabase.storage.from(ACC_BUCKET).remove([form._existingImage.path])
        }
        const uploaded = await uploadImage(form._imageFile, recordId)
        imageJson = uploaded  // { url, path }
      }

      // Update (or patch new record) with image
      const { data: upserted, error: upErr } = await supabase
        .from(ACC_TABLE)
        .update({ ...basePayload, image: imageJson })
        .eq('id', recordId)
        .select()
        .single()
      if (upErr) throw upErr

      showToast('success', isEdit ? 'Accessory updated.' : 'Accessory added.')
      onSaved(upserted)
    } catch (err) {
      console.error('Accessory save error:', err)
      showToast('error', 'Failed to save. Check console.')
    } finally {
      setSaving(false)
    }
  }

  const preview = form._imagePreview || form._existingImage?.url

  return (
    <div style={{
      background: '#0d0d0d', border: '1px solid #1a1a1a',
      padding: 32, marginBottom: 0, position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)' }} />

      {/* Form header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 300, color: '#f3f4f6', margin: 0 }}>
          {isEdit ? 'Edit Accessory' : 'New Accessory'}
        </p>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', padding: 4 }}>
          <X size={16} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Name */}
        <div style={{ gridColumn: '1 / -1' }}>
          <FieldLabel>Product Name *</FieldLabel>
          <LuxInput value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. LED Interior Light Kit" />
        </div>

        {/* Category */}
        <div>
          <FieldLabel>Category *</FieldLabel>
          <LuxSelect value={form.category} onChange={e => set('category', e.target.value)} options={CATEGORIES} />
        </div>

        {/* Price */}
        <div>
          <FieldLabel>Price (KES) *</FieldLabel>
          <LuxInput type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. 4500" />
        </div>

        {/* Badge */}
        <div>
          <FieldLabel>Badge (optional)</FieldLabel>
          <LuxInput value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="e.g. New · Best Seller · Sale" />
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, color: '#374151', marginTop: 4 }}>
            Shown as a label on the card. Leave blank for none.
          </p>
        </div>

      </div>

      {/* Image upload */}
      <div style={{ marginBottom: 28 }}>
        <FieldLabel>Product Image *</FieldLabel>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `1px dashed ${dragOver ? '#c9a84c' : '#1f1f1f'}`,
            background: dragOver ? 'rgba(201,168,76,.04)' : '#0a0a0a',
            padding: preview ? 0 : 32, cursor: 'pointer',
            textAlign: 'center', transition: 'all .2s',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}
        >
          {preview ? (
            <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 220, objectFit: 'contain', padding: 16, boxSizing: 'border-box' }} />
          ) : (
            <>
              <Upload size={20} color="#374151" />
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, color: '#4b5563', letterSpacing: 1, margin: 0 }}>
                Drag & drop or click to upload
              </p>
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, color: '#2a2a2a', margin: 0 }}>
                JPG, PNG, WEBP — transparent PNG recommended for accessories
              </p>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
        </div>
        {preview && (
          <button
            onClick={e => { e.stopPropagation(); set('_imageFile', null); set('_imagePreview', ''); set('_existingImage', null) }}
            style={{ marginTop: 6, fontSize: 10, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Montserrat',sans-serif", letterSpacing: 1 }}
          >
            Remove image
          </button>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{ padding: '10px 24px', border: '1px solid #2a2a2a', background: 'none', color: '#6b7280', fontFamily: "'Montserrat',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' }}>
          Cancel
        </button>
        <button
          onClick={handleSave} disabled={saving}
          style={{ padding: '10px 28px', border: 'none', background: '#c9a84c', color: '#000', fontFamily: "'Montserrat',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}
        >
          {saving ? <Loader2 size={13} style={{ animation: 'adSpin .7s linear infinite' }} /> : <Save size={13} />}
          {saving ? 'Saving…' : isEdit ? 'Update' : 'Add Accessory'}
        </button>
      </div>
    </div>
  )
}

// ── Main AccessoriesManager ───────────────────────────────────────────────────
export default function AccessoriesManager({ showToast }) {
  const [items,         setItems]         = useState([])
  const [loading,       setLoading]       = useState(true)
  const [showForm,      setShowForm]      = useState(false)
  const [editingItem,   setEditingItem]   = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deletingId,    setDeletingId]    = useState(null)
  const [collapsed,     setCollapsed]     = useState(false)

  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchItems = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from(ACC_TABLE)
        .select('id, name, category, price, image, badge')
        .order('id', { ascending: false })
      if (error) throw error
      const map = new Map()
      ;(data || []).forEach(a => {
        if (a.name && !map.has(a.name)) map.set(a.name, a)
      })
      setItems(Array.from(map.values()))
    } catch (err) {
      showToast?.('Error loading accessories', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  // ── After save ────────────────────────────────────────────────────────────
  const handleSaved = (record) => {
    setShowForm(false)
    setEditingItem(null)
    fetchItems()
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirmDelete) return
    const id = confirmDelete.id
    setDeletingId(id)
    try {
      if (confirmDelete.image?.path) {
        await supabase.storage.from(ACC_BUCKET).remove([confirmDelete.image.path])
      }
      const { error } = await supabase.from(ACC_TABLE).delete().eq('id', id)
      if (error) throw error
      showToast?.('Accessory deleted', 'success')
      setItems(prev => prev.filter(i => i.id !== id))
    } catch (err) {
      showToast?.(err.message || 'Delete failed', 'error')
    } finally {
      setDeletingId(null)
      setConfirmDelete(null)
    }
  }

  const openNew  = () => { setEditingItem(null); setShowForm(true); setCollapsed(false) }
  const openEdit = (item) => { setEditingItem(item); setShowForm(true); setCollapsed(false) }
  const cancelForm = () => { setShowForm(false); setEditingItem(null) }

  return (
    <div style={{ marginBottom: 32 }}>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className={`p-8 max-w-md w-[90%] border rounded-2xl relative shadow-2xl ${
              isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#0d0d0d] border-white/10 text-slate-100'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#ef4444,transparent)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <AlertTriangle size={17} color="#ef4444" />
              <p className={`font-serif text-xl font-light ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Delete accessory?</p>
            </div>
            <p className={`text-xs leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <strong className={isLight ? 'text-slate-900 font-bold' : 'text-slate-200'}>{confirmDelete.name}</strong> will be permanently removed along with its image. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider rounded-lg">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section header */}
      <div className={`border rounded-2xl overflow-hidden shadow-2xl transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#0b101d] border-white/10'
      }`}>
        <div className={`px-6 py-4 border-b flex items-center justify-between gap-4 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#070b15] border-white/10'
        }`}>
          <p className={`font-bold text-xs uppercase tracking-widest ${isLight ? 'text-amber-700' : 'text-[#c9a84c]'}`}>
            Accessories Manager
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <p className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {loading ? '…' : `${items.length} item${items.length !== 1 ? 's' : ''}`}
            </p>
            <button onClick={fetchItems} className="p-1 text-slate-500 hover:text-[#c9a84c] transition-all" title="Refresh">
              <RefreshCw size={14} />
            </button>
            <button
              onClick={openNew}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c9a84c] text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#d9b85c] shadow-md"
            >
              <Plus size={14} /> Add Item
            </button>
            <button onClick={() => setCollapsed(c => !c)} className="p-1 text-slate-500 hover:text-slate-300">
              {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </div>

        {!collapsed && (
          <>
            {/* Form */}
            {showForm && (
              <div style={{ padding: '24px 24px 0' }}>
                <AccessoryForm
                  initial={editingItem}
                  onSaved={handleSaved}
                  onCancel={cancelForm}
                  showToast={showToast}
                />
              </div>
            )}

            {/* Table */}
            {loading ? (
              <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <Loader2 size={20} color="#c9a84c" style={{ animation: 'adSpin .7s linear infinite' }} />
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Loading…</p>
              </div>
            ) : items.length === 0 ? (
              <div className={`p-12 text-center text-xs font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                No accessories yet — click <strong className="text-[#c9a84c]">Add Item</strong> to add your first product.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr className={isLight ? 'bg-slate-100 border-b border-slate-200' : 'bg-[#070b15] border-b border-white/10'}>
                      {['Image', 'Name', 'Category', 'Price', 'Badge', ''].map(h => (
                        <th key={h} className={`px-4 py-3 text-xs font-bold tracking-wider uppercase ${
                          h === '' ? 'text-right' : 'text-left'
                        } ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => {
                      const Icon = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.default
                      const imgUrl = item.image?.url ?? null

                      return (
                        <tr key={item.id} className={`border-b transition-colors ${
                          isLight ? 'border-slate-200 hover:bg-slate-50' : 'border-white/5 hover:bg-white/[0.02]'
                        }`}>

                          {/* Image */}
                          <td style={{ padding: '12px 16px' }}>
                            {imgUrl
                              ? <img src={imgUrl} alt="" className="w-14 h-14 object-contain bg-slate-900 border border-white/10 rounded-lg p-1 block shadow-sm" />
                              : <div className="w-14 h-14 bg-slate-900 border border-white/10 rounded-lg flex items-center justify-center">
                                  <Icon size={20} className="text-slate-500" />
                                </div>
                            }
                          </td>

                          {/* Name */}
                          <td style={{ padding: '12px 16px', maxWidth: 260 }}>
                            <p className={`font-serif text-base font-bold leading-snug ${
                              isLight ? 'text-slate-900' : 'text-slate-100'
                            }`}>
                              {item.name}
                            </p>
                            <p className={`text-xs font-semibold mt-0.5 ${
                              isLight ? 'text-slate-600' : 'text-slate-400'
                            }`}>
                              ID: {item.id}
                            </p>
                          </td>

                          {/* Category */}
                          <td style={{ padding: '12px 16px' }}>
                            <div className="flex items-center gap-2">
                              <Icon size={14} className={isLight ? 'text-amber-700' : 'text-[#c9a84c]'} />
                              <span className={`text-xs font-bold tracking-wide uppercase ${
                                isLight ? 'text-slate-800' : 'text-slate-300'
                              }`}>
                                {item.category}
                              </span>
                            </div>
                          </td>

                          {/* Price */}
                          <td style={{ padding: '12px 16px' }}>
                            <p className={`font-serif text-base font-bold ${
                              isLight ? 'text-amber-700' : 'text-[#c9a84c]'
                            }`}>
                              KES {Number(item.price).toLocaleString()}
                            </p>
                          </td>

                          {/* Badge */}
                          <td style={{ padding: '12px 16px' }}>
                            {item.badge
                              ? <span className={`inline-block text-[10px] tracking-wider uppercase font-bold px-2.5 py-1 rounded-md border ${
                                  isLight
                                    ? 'bg-amber-500/15 text-amber-800 border-amber-500/30'
                                    : 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30'
                                }`}>
                                  {item.badge}
                                </span>
                              : <span className={`text-xs font-semibold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>—</span>
                            }
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                title="Edit"
                                onClick={() => openEdit(item)}
                                className={`p-2 rounded-lg border transition-all ${
                                  isLight
                                    ? 'border-slate-200 text-slate-700 hover:text-amber-700 hover:bg-amber-500/10'
                                    : 'border-white/10 text-slate-400 hover:text-[#c9a84c] hover:bg-white/5'
                                }`}
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                title="Delete"
                                disabled={deletingId === item.id}
                                onClick={() => setConfirmDelete(item)}
                                className="p-2 rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-all"
                              >
                                {deletingId === item.id
                                  ? <Loader2 size={14} className="animate-spin" />
                                  : <Trash2 size={14} />
                                }
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}