'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';

export default function BlogGridPage() {
  const blogs = [
    {
      id: '1',
      title: '2026 Import Duty Changes: Complete Guide for Kenyan Buyers',
      excerpt: 'Detailed breakdown of the revised KRA customs duty calculation for luxury Mercedes, Range Rover, and Porsche imports.',
      date: 'Aug 18, 2026',
      readTime: '5 min read',
      author: 'Executive Editor',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop'
    },
    {
      id: '2',
      title: 'Why Certified Pre-Owned (CPO) Cars Hold Maximum Residual Value',
      excerpt: 'How 150-point comprehensive inspection certificates protect luxury car investments in East Africa.',
      date: 'Aug 14, 2026',
      readTime: '4 min read',
      author: 'Head of Valuation',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop'
    }
  ];

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-10">
        <div>
          <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">Automotive Intelligence</span>
          <h1 className="text-3xl font-black text-white uppercase mt-1">Buying Guides & Market News</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((b) => (
            <div key={b.id} className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl overflow-hidden hover:border-[#c9a84c]/50 transition-all flex flex-col">
              <img src={b.image} alt={b.title} className="w-full h-56 object-cover" />
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-4 text-xs text-neutral-500 mb-2">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {b.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {b.readTime}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white hover:text-[#c9a84c] transition-colors">{b.title}</h2>
                  <p className="text-xs text-neutral-400 mt-2">{b.excerpt}</p>
                </div>
                <Link href={`/blog/${b.id}`} className="text-xs font-bold text-[#c9a84c] uppercase flex items-center gap-1">
                  Read Article <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
