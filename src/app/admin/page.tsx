'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0 });

  useEffect(() => {
    const fetchStatus = async () => {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      setStats({
        products: prodData.length || 0,
        categories: catData.length || 0,
      });
    };
    fetchStatus();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-white leading-tight">Xush kelibsiz, <span className="text-blue-500">Admin</span> 👋</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl hover:border-blue-500/50 transition-all group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📦</div>
            <span className="text-gray-500 font-mono text-sm">Jami</span>
          </div>
          <h3 className="text-gray-400 font-medium mb-1 uppercase tracking-wider text-xs">Mahsulotlar</h3>
          <p className="text-5xl font-black text-white">{stats.products}</p>
        </div>

        <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl hover:border-purple-500/50 transition-all group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📂</div>
            <span className="text-gray-500 font-mono text-sm">Jami</span>
          </div>
          <h3 className="text-gray-400 font-medium mb-1 uppercase tracking-wider text-xs">Kategoriyalar</h3>
          <p className="text-5xl font-black text-white">{stats.categories}</p>
        </div>

        <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl hover:border-green-500/50 transition-all group col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📈</div>
            <span className="text-gray-500 font-mono text-sm">Status</span>
          </div>
          <h3 className="text-gray-400 font-medium mb-1 uppercase tracking-wider text-xs">Mini App Holati</h3>
          <p className="text-2xl font-bold text-green-400">Faol (Ishlamoqda)</p>
          <div className="mt-4 flex gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-gray-500 text-xs">Telegram Bot Token Ulangan</span>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-blue-600/10 border border-blue-500/20 rounded-3xl p-8 backdrop-blur-md">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Tezkor havolalar</h2>
        <div className="flex flex-wrap gap-4">
          <a href="/admin/products" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold transition-all shadow-lg">+ Mahsulot qo'shish</a>
          <a href="/admin/categories" className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-bold transition-all shadow-lg">Kategoriyalarni ko'rish</a>
        </div>
      </div>
    </div>
  );
}
