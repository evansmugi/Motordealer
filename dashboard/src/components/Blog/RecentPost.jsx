import React, { useState } from 'react'
import { Link }         from 'react-router-dom'
import { useBlogs }     from '../../hooks/useBlogs'
import BlogHeader       from './BlogHeader'
import BlogCard         from './BlogCard'
import { ArrowRight, Clock, Loader2 } from 'lucide-react'

// ── Skeleton for sidebar list items ──────────────────────────────────────────
function SidebarSkeleton() {
  return (
    <div className='flex gap-4 bg-white/[0.03] border border-[#c8a96e]/10 rounded-xl p-3 animate-pulse'>
      <div className='w-24 h-24 flex-shrink-0 rounded-lg bg-white/[0.08]' />
      <div className='flex flex-col justify-between flex-1 min-w-0 py-1'>
        <div className='h-2.5 w-16 bg-white/[0.08] rounded' />
        <div className='space-y-1.5'>
          <div className='h-3 w-full bg-white/[0.08] rounded' />
          <div className='h-3 w-3/4 bg-white/[0.08] rounded' />
        </div>
        <div className='h-2 w-20 bg-white/[0.05] rounded' />
      </div>
    </div>
  )
}

// ── Featured post skeleton ────────────────────────────────────────────────────
function FeaturedSkeleton() {
  return (
    <div className='lg:col-span-3 rounded-xl overflow-hidden border border-[#c8a96e]/10 animate-pulse'>
      <div className='w-full h-[260px] md:h-[340px] bg-white/[0.05]' />
    </div>
  )
}

const RecentPost = () => {
  const [allView, setAllView] = useState(false)

  // Only fetch the fields the sidebar + featured card actually render.
  // `description` is NOT included — saves bandwidth on this component.
  const { blogs, loading, error } = useBlogs({
    select: 'id, title, image_url, date, status',
  })

  const featured        = blogs[0]
  const sidebarBlogs    = allView ? blogs : blogs.slice(0, 2)

  return (
    <div className='w-full bg-black px-4 py-14 border-b border-[#c8a96e]/10'>
      <div className='lg:container mx-auto'>

        {/* Section header */}
        <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10'>
          <div>
            <p className='text-[#c8a96e] text-xs tracking-[0.22em] uppercase font-medium mb-2'>
              Latest from the blog
            </p>
            <h2 className='text-white text-2xl md:text-3xl font-bold'>
              Our Recent <span className='text-[#c8a96e]'>Posts</span>
            </h2>
            <div className='h-[2px] w-12 bg-[#c8a96e]/50 rounded-full mt-3' />
          </div>
          <Link
            to='/blog'
            className='flex items-center gap-1.5 text-[#c8a96e]/70 hover:text-[#c8a96e]
                       text-xs font-medium uppercase tracking-widest transition-colors duration-200'
          >
            View all posts <ArrowRight className='h-3.5 w-3.5' />
          </Link>
        </div>

        {error && (
          <p className='text-red-400 text-sm mb-6'>
            Could not load recent posts. Please refresh.
          </p>
        )}

        {/* Featured + sidebar layout */}
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10'>

          {/* Featured post */}
          {loading || !featured ? (
            <FeaturedSkeleton />
          ) : (
            <Link
              to={`/blog/${featured.id}`}
              className='lg:col-span-3 group relative rounded-xl overflow-hidden border border-[#c8a96e]/20
                         hover:border-[#c8a96e]/50 hover:shadow-[0_8px_32px_rgba(200,169,110,0.12)]
                         transition-all duration-300 block'
            >
              <div className='relative w-full h-[260px] md:h-[340px] overflow-hidden'>
                <img
                  src={featured.image_url}
                  alt={featured.title}
                  loading='lazy'
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent' />
                <span className='absolute top-4 left-4 bg-[#c8a96e] text-black text-[10px] font-bold
                                 uppercase tracking-widest px-3 py-1 rounded-full'>
                  {featured.status}
                </span>
              </div>

              <div className='absolute bottom-0 left-0 right-0 p-5'>
                <div className='flex items-center gap-1.5 mb-2'>
                  <Clock className='h-3 w-3 text-[#c8a96e]/70' />
                  <span className='text-white/50 text-[10px] tracking-wide'>{featured.date}</span>
                </div>
                <h3 className='text-white font-bold text-lg md:text-xl leading-snug
                               group-hover:text-[#c8a96e] transition-colors duration-200'>
                  {featured.title}
                </h3>
                <div className='flex items-center gap-1.5 mt-3 text-[#c8a96e] text-xs font-medium uppercase tracking-wider'>
                  Read article <ArrowRight className='h-3.5 w-3.5' />
                </div>
              </div>
            </Link>
          )}

          {/* Sidebar list */}
          <div className='lg:col-span-2 flex flex-col gap-4'>
            {loading
              ? [0, 1].map((i) => <SidebarSkeleton key={i} />)
              : sidebarBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    to={`/blog/${blog.id}`}
                    className='group flex gap-4 bg-white/[0.03] border border-[#c8a96e]/15 rounded-xl
                               p-3 hover:border-[#c8a96e]/45 hover:bg-white/[0.05]
                               hover:shadow-[0_4px_16px_rgba(200,169,110,0.08)]
                               transition-all duration-300'
                  >
                    <div className='w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden'>
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        loading='lazy'
                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                      />
                    </div>
                    <div className='flex flex-col justify-between min-w-0'>
                      <span className='text-[#c8a96e] text-[10px] font-bold uppercase tracking-widest'>
                        {blog.status}
                      </span>
                      <h4 className='text-white text-sm font-semibold leading-snug line-clamp-2
                                     group-hover:text-[#c8a96e] transition-colors duration-200 mt-1'>
                        {blog.title}
                      </h4>
                      <div className='flex items-center gap-1 mt-1'>
                        <Clock className='h-3 w-3 text-white/30' />
                        <span className='text-white/40 text-[10px]'>{blog.date}</span>
                      </div>
                    </div>
                  </Link>
                ))
            }

            {!allView && !loading && blogs.length > 2 && (
              <button
                onClick={() => setAllView(true)}
                className='w-full mt-1 py-2.5 border border-[#c8a96e]/30 text-[#c8a96e]
                           hover:bg-[#c8a96e]/10 text-xs font-medium uppercase tracking-widest
                           rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
              >
                Show more posts <ArrowRight className='h-3.5 w-3.5' />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default RecentPost