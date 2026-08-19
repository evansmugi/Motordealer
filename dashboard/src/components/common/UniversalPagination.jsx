import React, { useState } from 'react'
import { useCRMStore } from '../../context/CRMStore'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowRight
} from 'lucide-react'

export default function UniversalPagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange = () => {},
  onItemsPerPageChange = null,
  pageSizeOptions = [10, 25, 50, 100],
  className = ''
}) {
  const [jumpPage, setJumpPage] = useState('')
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  if (totalItems === 0) return null

  // Calculate range numbers (1-indexed)
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Generate page numbers with smart ellipsis truncation
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      if (currentPage <= 3) {
        startPage = 2
        endPage = 4
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3
        endPage = totalPages - 1
      }

      pages.push(1)
      if (startPage > 2) pages.push('...')
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      if (endPage < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  const handleJumpSubmit = (e) => {
    e.preventDefault()
    const pageNum = parseInt(jumpPage, 10)
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum)
      setJumpPage('')
    }
  }

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-300 font-mono text-xs select-none ${
        isLight
          ? 'bg-white border-slate-200 text-slate-700 shadow-xl'
          : 'bg-[#070b14]/90 border-white/10 text-slate-300 shadow-2xl backdrop-blur-xl'
      } ${className}`}
    >
      {/* Left Info & Items Per Page Selector */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Item Range Counter */}
        <div className="flex items-center gap-1.5">
          <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Showing</span>
          <span className={`font-bold px-2 py-0.5 rounded border ${
            isLight ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-slate-800 text-white border-white/10'
          }`}>
            {startItem.toLocaleString()} – {endItem.toLocaleString()}
          </span>
          <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>of</span>
          <span className="font-bold text-[#c9a84c]">{totalItems.toLocaleString()}</span>
          <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>entries</span>
        </div>

        {/* Page Size Selector */}
        {onItemsPerPageChange && (
          <div className={`flex items-center gap-2 pl-3 border-l ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
            <span className={isLight ? 'text-slate-500 text-[11px]' : 'text-slate-400 text-[11px]'}>Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className={`rounded-lg px-2.5 py-1 font-bold outline-none border focus:border-[#c9a84c] transition-all cursor-pointer ${
                isLight ? 'bg-slate-50 text-slate-900 border-slate-300' : 'bg-slate-900 text-slate-100 border-white/10'
              }`}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-white'}>
                  {option} / page
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Center & Right Navigation Buttons & Page Jump Input */}
      <div className="flex flex-wrap items-center gap-2">
        {/* First Page Button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-xl border disabled:opacity-30 disabled:pointer-events-none transition-all ${
            isLight
              ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:border-[#c9a84c]'
              : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-[#c9a84c]/50'
          }`}
          title="First Page"
        >
          <ChevronsLeft size={14} />
        </button>

        {/* Previous Page Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-xl border disabled:opacity-30 disabled:pointer-events-none transition-all ${
            isLight
              ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:border-[#c9a84c]'
              : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-[#c9a84c]/50'
          }`}
          title="Previous Page"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Truncated Numeric Page Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${idx}`} className={`px-2 py-1 font-bold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  ...
                </span>
              )
            }

            const isActive = page === currentPage
            return (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page)}
                className={`min-w-[34px] h-[34px] px-2 rounded-xl font-bold transition-all border ${
                  isActive
                    ? 'bg-[#c9a84c] text-black border-[#c9a84c] shadow-lg shadow-[#c9a84c]/20'
                    : isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:border-slate-300'
                    : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-white/30'
                }`}
              >
                {page}
              </button>
            )
          })}
        </div>

        {/* Next Page Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-xl border disabled:opacity-30 disabled:pointer-events-none transition-all ${
            isLight
              ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:border-[#c9a84c]'
              : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-[#c9a84c]/50'
          }`}
          title="Next Page"
        >
          <ChevronRight size={14} />
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-xl border disabled:opacity-30 disabled:pointer-events-none transition-all ${
            isLight
              ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:border-[#c9a84c]'
              : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-[#c9a84c]/50'
          }`}
          title="Last Page"
        >
          <ChevronsRight size={14} />
        </button>

        {/* Quick Page Jump Form */}
        {totalPages > 5 && (
          <form
            onSubmit={handleJumpSubmit}
            className={`flex items-center gap-1.5 pl-3 border-l ${isLight ? 'border-slate-200' : 'border-white/10'}`}
          >
            <span className={isLight ? 'text-slate-500 text-[11px]' : 'text-slate-400 text-[11px]'}>Go:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder="#"
              className={`w-12 border rounded-lg px-2 py-1 text-center font-bold outline-none focus:border-[#c9a84c] transition-all ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-900 border-white/10 text-slate-100 placeholder:text-slate-600'
              }`}
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30 hover:bg-[#c9a84c] hover:text-black transition-all"
              title="Jump to page"
            >
              <ArrowRight size={12} />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
