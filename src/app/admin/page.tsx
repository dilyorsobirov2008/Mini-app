'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlusCircle, 
  TrendingUp, 
  Users, 
  Activity, 
  Package, 
  Layers, 
  ShoppingCart,
  ArrowUpRight,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('uz-UZ').format(price);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-pulse">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-2xl animate-spin" />
      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Initializing Nexus Core...</p>
    </div>
  );

  const dashboardStats = [
    { 
      label: 'MAXSULOTLAR', 
      value: stats?.products || 0, 
      icon: <Package size={28} />, 
      color: 'from-blue-500 to-cyan-500', 
      tag: 'Inventory',
      trend: '+12%' 
    },
    { 
      label: 'KATEGORIYALAR', 
      value: stats?.categories || 0, 
      icon: <Layers size={28} />, 
      color: 'from-purple-500 to-pink-500', 
      tag: 'Architecture' ,
      trend: 'Optimal'
    },
    { 
      label: 'BUYURTMALAR', 
      value: stats?.orders || 0, 
      icon: <ShoppingCart size={28} />, 
      color: 'from-orange-500 to-red-500', 
      tag: 'Total Sales',
      trend: '+24%'
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto stagger-children">
      {/* ── Welcome Section ── */}
      <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-full">System Live</span>
             <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-glow" />
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-4">
            Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-black italic">Center</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Operations Oversight & Real-time Metrics</p>
        </div>
        
        <div className="flex gap-3">
          <Link 
            href="/admin/products" 
            className="flex items-center gap-3 px-8 py-5 bg-white text-black font-black text-[11px] uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            <PlusCircle size={18} strokeWidth={2.5} /> Yangi mahsulot
          </Link>
        </div>
      </header>
      
      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {dashboardStats.map((stat, i) => (
          <div 
            key={i} 
            className="group relative bg-[#0c0c14] p-1 rounded-[40px] shadow-2xl overflow-hidden glass-elevated hover:border-indigo-500/30 transition-all duration-500 border-white/5"
          >
            <div className="p-10 relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-[24px] flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">{stat.tag}</span>
                  <div className="flex items-center gap-1 justify-end text-green-400 text-[10px] font-black italic uppercase">
                     {stat.trend} <TrendingUp size={12} />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-gray-600 font-black mb-1 uppercase tracking-widest text-[10px]">{stat.label}</h3>
                <p className="text-7xl font-black text-white tracking-tighter group-hover:text-indigo-400 transition-colors duration-500">{stat.value}</p>
              </div>
            </div>
            {/* Ambient Background Gradient */}
            <div className={`absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 blur-[80px] transition-opacity duration-700`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* ── Recent Activity (2/3 width) ── */}
        <div className="xl:col-span-2 glass shadow-3xl rounded-[48px] border border-white/5 p-10 overflow-hidden relative">
           <div className="flex justify-between items-center mb-10 relative z-10">
              <div>
                 <h2 className="text-2xl font-black uppercase tracking-tight">Real-time Activity</h2>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Live order flow coming through the mini app</p>
              </div>
              <Link href="/admin/orders" className="flex items-center gap-2 text-[10px] font-black text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
                 View History <ArrowUpRight size={14} />
              </Link>
           </div>
           
           <div className="space-y-4 relative z-10">
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order: any, idx: number) => (
                  <div 
                    key={order.id} 
                    className="flex items-center justify-between p-6 rounded-[32px] bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 group"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-2xl bg-[#14141f] border border-white/5 flex items-center justify-center text-xl shadow-lg">
                          👤
                       </div>
                       <div>
                         <p className="font-black text-white text-base tracking-tight mb-1">{order.customer}</p>
                         <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full border border-green-500/10">Active Order</span>
                         </div>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-white text-lg tracking-tighter mb-1">{formatPrice(order.total)} <span className="text-[10px] text-gray-600 uppercase font-black">so'm</span></p>
                       <button className="text-[9px] font-black text-indigo-500 uppercase border-b border-indigo-500/0 hover:border-indigo-500 transition-all">Details</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Activity className="text-gray-800 mb-6 animate-pulse" size={64} />
                  <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.4em]">No Live Data Streams...</p>
                </div>
              )}
           </div>
           {/* Decorative bg */}
           <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
        </div>

        {/* ── System Health & Quick Monitoring (1/3 width) ── */}
        <div className="space-y-10">
           {/* System Hub */}
           <div className="bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-indigo-500/20 rounded-[48px] p-10 relative overflow-hidden group shadow-3xl">
              <h2 className="text-xl font-black uppercase tracking-tight mb-8 relative z-10">System Nexus</h2>
              
              <div className="space-y-6 relative z-10">
                 <div className="p-6 rounded-[32px] bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between group-hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-4">
                       <Users className="text-indigo-400" size={20} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Users</span>
                    </div>
                    <span className="font-black text-white">1,248</span>
                 </div>
                 <div className="p-6 rounded-[32px] bg-purple-500/5 border border-purple-500/10 flex items-center justify-between group-hover:border-purple-500/30 transition-all">
                    <div className="flex items-center gap-4">
                       <Activity className="text-purple-400" size={20} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Server Load</span>
                    </div>
                    <span className="font-black text-white text-green-400">Low</span>
                 </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5 relative z-10 text-center">
                <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 mx-auto hover:gap-4 transition-all group/btn">
                  System Diagnostics <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Decorative Pulse */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px] animate-pulse" />
           </div>

           {/* Bot Connection */}
           <div className="glass-elevated border border-white/5 rounded-[48px] p-10 shadow-3xl relative overflow-hidden">
               <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <span className="block w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                    <span className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping opacity-25" />
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-xs text-green-400">Core Network Online</h3>
               </div>
               <p className="text-gray-500 text-sm font-bold leading-relaxed mb-6">
                 Telegram Mini App SDK protokoli orqali barcha jarayonlar xavfsiz kanallar orqali uzatilmoqda.
               </p>
               <div className="bg-black/40 p-5 rounded-3xl border border-white/5">
                 <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest mb-1 text-gray-600">
                   <span>Latency</span>
                   <span className="text-green-400">24ms</span>
                 </div>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500/40 w-[95%]" />
                 </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}
