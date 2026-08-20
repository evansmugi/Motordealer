'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Check, Search, ShieldCheck } from 'lucide-react';
import PredictiveSelect from '../../components/common/PredictiveSelect';

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'Performance Parts', label: 'Performance Parts' },
  { value: 'Car Care & Detailing', label: 'Car Care & Detailing' },
  { value: 'Wheels & Rims', label: 'Wheels & Rims' },
  { value: 'Interior Accessories', label: 'Interior Accessories' }
];

export default function AccessoriesPage() {
  const [category, setCategory] = useState('');

  const items = [
    {
      id: '1',
      name: 'AMG 22-Inch Monoblock Forged Wheel Set',
      category: 'Wheels & Rims',
      price: 'KES 850,000',
      image: 'https://images.unsplash.com/photo-1611821064430-0d41084da596?w=600&auto=format&fit=crop',
      inStock: true
    },
    {
      id: '2',
      name: 'Gtechniq Crystal Serum Ultra Ceramic Coating Kit',
      category: 'Car Care & Detailing',
      price: 'KES 45,000',
      image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&auto=format&fit=crop',
      inStock: true
    },
    {
      id: '3',
      name: 'Brembo GT-R Monoblock Brake Kit',
      category: 'Performance Parts',
      price: 'KES 620,000',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop',
      inStock: true
    }
  ];

  const filteredItems = items.filter(i => !category || i.category === category);

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto py-12 px-6 space-y-8">
        <div>
          <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">Genuine Equipment</span>
          <h1 className="text-3xl font-black text-white uppercase mt-1">Luxury Accessories & Performance Equipment</h1>
        </div>

        <div className="bg-[#0a0a0a] border border-neutral-800 p-4 rounded-2xl max-w-sm">
          <label className="block text-xs font-semibold text-neutral-400 mb-1">Category Filter</label>
          <PredictiveSelect options={CATEGORY_OPTIONS} value={category} onChange={setCategory} placeholder="All Categories" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-xl" />
              <div>
                <span className="text-[10px] text-neutral-500 uppercase">{item.category}</span>
                <h3 className="text-sm font-bold text-white mt-1">{item.name}</h3>
                <div className="text-base font-extrabold text-[#c9a84c] mt-2">{item.price}</div>
              </div>
              <button className="w-full py-2.5 bg-[#c9a84c] text-black font-bold text-xs rounded-xl uppercase flex items-center justify-center gap-2">
                <ShoppingBag size={14} /> Order Accessory
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
