import React from 'react'
import { Link } from 'react-router-dom'

/**
 * BlogCard — receives a single blog object from Supabase.
 * Uses `image_url` (Supabase Storage URL) instead of the old imported local image.
 */
function BlogCard({ blog }) {
  return (
    <div className='bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl
                    transition-shadow duration-300 flex flex-col h-full'>

      <div className='w-full h-[250px] md:h-[280px] overflow-hidden'>
        <img
          src={blog?.image_url}
          className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
          alt={blog?.title}
          loading='lazy'
        />
      </div>

      <div className='flex flex-col flex-grow p-6 space-y-4'>
        <div className='flex items-center gap-4'>
          <h5 className='text-sm text-gray-700 font-bold uppercase'>{blog?.status}</h5>
          <span className='text-sm text-gray-500 font-semibold'>{blog?.date}</span>
        </div>

        <h3 className='text-xl md:text-2xl text-gray-900 font-bold capitalize line-clamp-2'>
          {blog?.title}
        </h3>

        <p className='text-base text-gray-600 line-clamp-3 flex-grow'>
          {blog?.description?.slice(0, 150)}...
        </p>

        <Link
          to={`/blog/${blog?.id}`}
          className='text-base text-[#f9b341] font-bold capitalize
                     hover:text-[#e0a030] transition-colors inline-block mt-auto'
        >
          Read More →
        </Link>
      </div>
    </div>
  )
}

export default BlogCard