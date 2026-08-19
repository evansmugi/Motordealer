import React from 'react'

function BlogHeader({title, subtitle, style, description}) {
  return (
    <div className={`space-y-6 flex flex-col items-center ${style}`}>
        {
            subtitle && <h4>{subtitle}</h4>
        }
        {
             <h3 className='md:text-2xl text-xl text-gray text-center font-bold uppercase'>{title}</h3>
        }
        {
            description && <p className='text-base text-gray font-normal max-w-[756px] w-full text-center'>{description}</p>
        }
    </div>
  )
}

export default BlogHeader