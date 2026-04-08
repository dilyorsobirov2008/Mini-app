'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  Settings, 
  Search, 
  Bell, 
  ExternalLink,
  ChevronRight,
  User,
  LogOut
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'DASHBOARD', icon: <LayoutDashboard size={20} />, href: '/admin' },
    { label: 'MAHSULOTLAR', icon: <Package size={20} />, href: '/admin/products' },
    { label: 'KATEGORIYALAR', icon: <Layers size={20} />, href: '/admin/categories' },
    { label: 'BUYURTMALAR', icon: <ShoppingCart size={20} />, href: '/admin/orders' },
  ];

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-white selection:bg-indigo-500/30">
      {/* ── Sidebar ── */}
      <aside className="w-80 hidden lg:flex flex-col sticky top-0 h-screen p-6 z-50">
        <div className="flex-1 glass shadow-2xl rounded-[40px] flex flex-col overflow-hidden border-white/5">
          {/* Logo */}
          <div className="p-10 pb-6">
            <Link href="/admin" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter text-white">BOZORCHA</h1>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-none">Console v2.0</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-5 pt-8 space-y-2 overflow-y-auto admin-scrollbar">
            <p className="px-5 mb-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">General</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl text-[11px] font-black tracking-widest transition-all duration-300 group ${
                    isActive 
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  {isActive && <ChevronRight size={14} className="opacity-50" />}
                </Link>
              );
            })}

            <div className="pt-8 px-5 mb-4 mt-8 border-t border-white/5">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">System</p>
            </div>
            <Link href="/admin/settings" className="flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black text-gray-500 hover:text-white hover:bg-white/5 transition-all">
              <Settings size={20} /> SOZLAMALAR
            </Link>
          </nav>

          {/* User Profile */}
          <div className="p-6">
             <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <User size={18} />
                   </div>
                   <div>
                      <p className="text-xs font-black text-white uppercase">Dilyor S.</p>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Administrator</p>
                   </div>
                </div>
                <button className="p-2 text-gray-600 hover:text-red-400 transition-colors">
                   <LogOut size={16} />
                </button>
             </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Header Bar */}
        <header className={`sticky top-0 z-40 px-8 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'glass-elevated py-4' : 'bg-transparent py-8'
        }`}>
           <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-md hidden md:block">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                 <input 
                  type="text" 
                  placeholder="Global search..." 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-indigo-500/40 transition-all outline-none"
                 />
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-all hover:bg-white/10 relative">
                 <Bell size={20} />
                 <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full ring-4 ring-[#0a0a0f]" />
              </button>
              <Link 
                href="/" 
                target="_blank"
                className="flex items-center gap-2 px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500/20 transition-all"
              >
                 Open Mini App <ExternalLink size={14} />
              </Link>
           </div>
        </header>

        <main className="flex-1 px-8 lg:px-12 pb-12 animate-fade-in relative z-10">
          {children}
        </main>

        {/* Backdrop Decorative Glows */}
        <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      </div>
    </div>
  );
}
