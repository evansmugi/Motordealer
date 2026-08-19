import React, { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/superbaseClient.js'
import { useCRMStore } from '../../context/CRMStore.js'
import {
  Plus, Pencil, Trash2, X, Upload, AlertTriangle,
  Loader2, Eye, ChevronDown, ChevronUp, Save,
} from 'lucide-react'

const BLOG_TABLE  = 'blogs'
const BLOG_BUCKET = 'blog-images'

// ── Helpers ───────────────────────────────────────────────────────────────────
const slugDate  = () => new Date().toISOString().split('T')[0]   // "2025-06-01"
const genId     = () => `${Date.now()}.${Math.floor(Math.random() * 9)}`

const STATUS_OPTIONS = [
  'Market Recovery', 'Top Models', 'Used Cars', 'Regulations',
  'Electric Vehicles', 'SUVs & MPVs', 'Online Buying', 'Honda Rising',
  'Industry News', 'Tips & Advice',
]

const EMPTY_FORM = {
  id: '', title: '', status: STATUS_OPTIONS[0], date: slugDate(),
  description: '', image_url: '', _imageFile: null, _imagePreview: '',
}

// ── Inner sub-components ──────────────────────────────────────────────────────

function FieldLabel({ children }) {
  return (
    <p style={{
      fontFamily: "'Montserrat',sans-serif",
      fontSize: 9, letterSpacing: 3,
      textTransform: 'uppercase', color: '#4b5563',
      fontWeight: 500, marginBottom: 6,
    }}>
      {children}
    </p>
  )
}

function LuxInput({ value, onChange, placeholder, type = 'text', disabled }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: '100%', background: '#0a0a0a',
        border: '1px solid #1f1f1f', color: '#d1d5db',
        padding: '10px 14px', fontSize: 13, outline: 'none',
        fontFamily: "'Montserrat',sans-serif",
        boxSizing: 'border-box',
        opacity: disabled ? 0.5 : 1,
      }}
    />
  )
}

function LuxTextarea({ value, onChange, rows = 6, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      style={{
        width: '100%', background: '#0a0a0a',
        border: '1px solid #1f1f1f', color: '#d1d5db',
        padding: '10px 14px', fontSize: 13, outline: 'none',
        fontFamily: "'Montserrat',sans-serif",
        resize: 'vertical', boxSizing: 'border-box',
        lineHeight: 1.7,
      }}
    />
  )
}

function LuxSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: '100%', background: '#0a0a0a',
        border: '1px solid #1f1f1f', color: '#d1d5db',
        padding: '10px 14px', fontSize: 13, outline: 'none',
        fontFamily: "'Montserrat',sans-serif",
        boxSizing: 'border-box', appearance: 'none',
        cursor: 'pointer',
      }}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

// ── Blog post form (create + edit) ────────────────────────────────────────────
function BlogForm({ initial, onSaved, onCancel, showToast }) {
  const [form,     setForm]     = useState(initial || { ...EMPTY_FORM, id: genId() })
  const [saving,   setSaving]   = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const isEdit = !!initial

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // ── Image handling ──────────────────────────────────────────────────────────
  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    set('_imageFile', file)
    set('_imagePreview', URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    handleImageFile(e.dataTransfer.files[0])
  }

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim())       return showToast('error', 'Title is required.')
    if (!form.description.trim()) return showToast('error', 'Body text is required.')
    if (!form.image_url && !form._imageFile) return showToast('error', 'Please upload a cover image.')

    setSaving(true)
    try {
      let imageUrl = form.image_url

      // Upload new image if selected
      if (form._imageFile) {
        const ext  = form._imageFile.name.split('.').pop()
        const path = `${form.id}-${Date.now()}.${ext}`

        const { error: upErr } = await supabase.storage
          .from(BLOG_BUCKET)
          .upload(path, form._imageFile, { upsert: true, contentType: form._imageFile.type })

        if (upErr) throw upErr

        const { data: urlData } = supabase.storage.from(BLOG_BUCKET).getPublicUrl(path)
        imageUrl = urlData.publicUrl
      }

      const payload = {
        id:          form.id,
        title:       form.title.trim(),
        status:      form.status,
        date:        form.date,
        description: form.description.trim(),
        image_url:   imageUrl,
      }

      const { error: dbErr } = await supabase
        .from(BLOG_TABLE)
        .upsert(payload, { onConflict: 'id' })

      if (dbErr) throw dbErr

      showToast('success', isEdit ? 'Post updated.' : 'Post published.')
      onSaved(payload)
    } catch (err) {
      console.error('Blog save error:', err)
      showToast('error', 'Failed to save post. Check console.')
    } finally {
      setSaving(false)
    }
  }

  const preview = form._imagePreview || form.image_url

  return (
    <div style={{
      background: '#0d0d0d', border: '1px solid #1a1a1a',
      padding: '32px', marginBottom: 24,
      position: 'relative',
    }}>
      {/* Gold top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 300, color: '#f3f4f6' }}>
          {isEdit ? 'Edit Post' : 'New Blog Post'}
        </p>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', padding: 4 }}>
          <X size={16} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Title */}
        <div style={{ gridColumn: '1 / -1' }}>
          <FieldLabel>Post Title *</FieldLabel>
          <LuxInput value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Kenya's Auto Market in 2025" />
        </div>

        {/* Category / Status */}
        <div>
          <FieldLabel>Category *</FieldLabel>
          <LuxSelect value={form.status} onChange={e => set('status', e.target.value)} options={STATUS_OPTIONS} />
        </div>

        {/* Date */}
        <div>
          <FieldLabel>Publish Date</FieldLabel>
          <LuxInput type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>

        {/* Post ID (auto, readonly) */}
        <div>
          <FieldLabel>Post ID (auto-generated)</FieldLabel>
          <LuxInput value={form.id} disabled />
        </div>
      </div>

      {/* Body */}
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Body Text *</FieldLabel>
        <LuxTextarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={7}
          placeholder="Write your full article here…"
        />
        <p style={{ fontSize: 10, color: '#374151', marginTop: 4, fontFamily: "'Montserrat',sans-serif" }}>
          {form.description.length} characters
        </p>
      </div>

      {/* Cover image */}
      <div style={{ marginBottom: 28 }}>
        <FieldLabel>Cover Image *</FieldLabel>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `1px dashed ${dragOver ? '#c9a84c' : '#1f1f1f'}`,
            background: dragOver ? 'rgba(201,168,76,.04)' : '#0a0a0a',
            padding: 24, textAlign: 'center', cursor: 'pointer',
            transition: 'all .2s',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="cover"
              style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <>
              <Upload size={20} color="#374151" />
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, color: '#4b5563', letterSpacing: 1 }}>
                Drag & drop or click to upload
              </p>
              <p style={{ fontSize: 10, color: '#2a2a2a', fontFamily: "'Montserrat',sans-serif" }}>
                JPG, PNG, WEBP — recommended 1200 × 800px
              </p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => handleImageFile(e.target.files[0])}
          />
        </div>
        {preview && (
          <button
            onClick={e => { e.stopPropagation(); set('_imageFile', null); set('_imagePreview', ''); set('image_url', '') }}
            style={{ marginTop: 6, fontSize: 10, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Montserrat',sans-serif", letterSpacing: 1 }}
          >
            Remove image
          </button>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{ padding: '10px 24px', border: '1px solid #2a2a2a', background: 'none', color: '#6b7280', fontFamily: "'Montserrat',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ padding: '10px 28px', border: 'none', background: '#c9a84c', color: '#000', fontFamily: "'Montserrat',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}
        >
          {saving ? <Loader2 size={13} style={{ animation: 'adSpin .7s linear infinite' }} /> : <Save size={13} />}
          {saving ? 'Saving…' : isEdit ? 'Update Post' : 'Publish Post'}
        </button>
      </div>
    </div>
  )
}

// ── Main BlogManager component ─────────────────────────────────────────────────
export default function BlogManager({ showToast }) {
  const [posts,          setPosts]          = useState([])
  const [loading,        setLoading]        = useState(true)
  const [showForm,       setShowForm]       = useState(false)
  const [editingPost,    setEditingPost]    = useState(null)   // null = new post
  const [confirmDelete,  setConfirmDelete]  = useState(null)
  const [deletingId,     setDeletingId]     = useState(null)
  const [collapsed,      setCollapsed]      = useState(false)

  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchPosts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from(BLOG_TABLE)
        .select('id, title, status, date, image_url, description')
        .order('date', { ascending: false })
      if (error) throw error
      setPosts(data || [])
    } catch (err) {
      showToast?.('Could not load blog posts', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [])

  // ── After save ────────────────────────────────────────────────────────────
  const handleSaved = (record) => {
    setShowForm(false)
    setEditingPost(null)
    fetchPosts()
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirmDelete) return
    const target = confirmDelete
    setDeletingId(target.id)
    try {
      if (target.image_url) {
        const urlParts = target.image_url.split('/')
        const fileName = urlParts[urlParts.length - 1]
        if (fileName) {
          await supabase.storage.from(BLOG_BUCKET).remove([fileName])
        }
      }
      const { error } = await supabase.from(BLOG_TABLE).delete().eq('id', target.id)
      if (error) throw error
      setPosts(prev => prev.filter(p => p.id !== target.id))
      showToast?.('Blog post deleted', 'success')
    } catch (err) {
      showToast?.('Failed to delete blog post', 'error')
    } finally {
      setDeletingId(null)
      setConfirmDelete(null)
    }
  }

  const openNew  = () => { setEditingPost(null); setShowForm(true); setCollapsed(false) }
  const openEdit = (post) => { setEditingPost(post); setShowForm(true); setCollapsed(false) }
  const cancelForm = () => { setShowForm(false); setEditingPost(null) }

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
              <p className={`font-serif text-xl font-light ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Delete post?</p>
            </div>
            <p className={`text-xs leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <strong className={isLight ? 'text-slate-900 font-bold' : 'text-slate-200'}>{confirmDelete.title}</strong> will be permanently removed. This cannot be undone.
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
            Blog Manager
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <p className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {loading ? '…' : `${posts.length} post${posts.length !== 1 ? 's' : ''}`}
            </p>
            <button
              onClick={openNew}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c9a84c] text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#d9b85c] shadow-md"
            >
              <Plus size={14} /> New Post
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
                <BlogForm
                  initial={editingPost ? { ...editingPost } : undefined}
                  onSaved={handleSaved}
                  onCancel={cancelForm}
                  showToast={showToast}
                />
              </div>
            )}

            {/* Posts table */}
            {loading ? (
              <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <Loader2 size={20} color="#c9a84c" style={{ animation: 'adSpin .7s linear infinite' }} />
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Loading…</p>
              </div>
            ) : posts.length === 0 ? (
              <div className={`p-12 text-center text-xs font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                No blog posts yet — click <strong className="text-[#c9a84c]">New Post</strong> to write your first article.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr className={isLight ? 'bg-slate-100 border-b border-slate-200' : 'bg-[#070b15] border-b border-white/10'}>
                      {['Cover', 'Title', 'Category', 'Date', 'Preview', ''].map(h => (
                        <th key={h} className={`px-4 py-3 text-xs font-bold tracking-wider uppercase ${
                          h === '' ? 'text-right' : 'text-left'
                        } ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map(post => (
                      <tr key={post.id} className={`border-b transition-colors ${
                        isLight ? 'border-slate-200 hover:bg-slate-50' : 'border-white/5 hover:bg-white/[0.02]'
                      }`}>
                        {/* Cover thumbnail */}
                        <td style={{ padding: '12px 16px' }}>
                          {post.image_url
                            ? <img src={post.image_url} alt="" className="w-16 h-11 object-cover rounded-lg border border-white/10 shadow-sm" />
                            : <div className="w-16 h-11 bg-slate-900 border border-white/10 rounded-lg flex items-center justify-center">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">No img</span>
                              </div>
                          }
                        </td>

                        {/* Title */}
                        <td style={{ padding: '12px 16px', maxWidth: 260 }}>
                          <p className={`font-serif text-base font-bold leading-snug ${
                            isLight ? 'text-slate-900' : 'text-slate-100'
                          }`}>
                            {post.title}
                          </p>
                          <p className={`text-xs font-semibold mt-0.5 ${
                            isLight ? 'text-slate-600' : 'text-slate-400'
                          }`}>
                            ID: {post.id}
                          </p>
                        </td>

                        {/* Category badge */}
                        <td style={{ padding: '12px 16px' }}>
                          <span className={`inline-block text-[10px] tracking-wider uppercase font-bold px-2.5 py-1 rounded-md border ${
                            isLight
                              ? 'bg-amber-500/15 text-amber-800 border-amber-500/30'
                              : 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30'
                          }`}>
                            {post.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td style={{ padding: '12px 16px' }}>
                          <p className={`text-xs font-bold ${
                            isLight ? 'text-slate-800' : 'text-slate-300'
                          }`}>{post.date}</p>
                        </td>

                        {/* Description preview */}
                        <td style={{ padding: '12px 16px', maxWidth: 220 }}>
                          <p className={`text-xs font-medium leading-relaxed line-clamp-2 ${
                            isLight ? 'text-slate-700' : 'text-slate-300'
                          }`}>
                            {post.description?.slice(0, 120)}…
                          </p>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              title="View on site"
                              onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                              className={`p-2 rounded-lg border transition-all ${
                                isLight
                                  ? 'border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                                  : 'border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                              }`}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              title="Edit post"
                              onClick={() => openEdit(post)}
                              className={`p-2 rounded-lg border transition-all ${
                                isLight
                                  ? 'border-slate-200 text-slate-700 hover:text-amber-700 hover:bg-amber-500/10'
                                  : 'border-white/10 text-slate-400 hover:text-[#c9a84c] hover:bg-white/5'
                              }`}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              title="Delete post"
                              disabled={deletingId === post.id}
                              onClick={() => setConfirmDelete(post)}
                              className="p-2 rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-all"
                            >
                              {deletingId === post.id
                                ? <Loader2 size={14} className="animate-spin" />
                                : <Trash2 size={14} />
                              }
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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